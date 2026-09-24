// HNSW-Graph (Hierarchical Navigable Small World, Malkov & Yashunin 2018) für die Nachbarsuche
// auf L2-normalisierten Vektoren (Ähnlichkeit = Skalarprodukt). Ohne Abhängigkeiten, deterministisch (fester Zufallsstart).
// ADR-024: Wird ab einer konfigurierbaren Bestandsgröße statt der exakten Suche verwendet.

export interface HnswOptions {
  /** Nachbarn je Knoten und Ebene (Ebene 0: 2·M) */
  M?: number;
  efConstruction?: number;
  seed?: number;
}

export interface Neighbor {
  id: number;
  score: number;
}

/** Binärer Heap über (Knoten, Ähnlichkeit); `max`: größte Ähnlichkeit oben */
class Heap {
  ids: number[] = [];
  s: number[] = [];
  constructor(private readonly max: boolean) {}
  get size() {
    return this.ids.length;
  }
  topScore() {
    return this.s[0];
  }
  topId() {
    return this.ids[0];
  }
  private better(i: number, j: number) {
    return this.max ? this.s[i] > this.s[j] : this.s[i] < this.s[j];
  }
  private swap(i: number, j: number) {
    [this.ids[i], this.ids[j]] = [this.ids[j], this.ids[i]];
    [this.s[i], this.s[j]] = [this.s[j], this.s[i]];
  }
  push(id: number, score: number) {
    this.ids.push(id);
    this.s.push(score);
    let i = this.ids.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (!this.better(i, p)) break;
      this.swap(i, p);
      i = p;
    }
  }
  pop(): Neighbor {
    const top = { id: this.ids[0], score: this.s[0] };
    const lastId = this.ids.pop()!;
    const lastS = this.s.pop()!;
    if (this.ids.length) {
      this.ids[0] = lastId;
      this.s[0] = lastS;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let b = i;
        if (l < this.ids.length && this.better(l, b)) b = l;
        if (r < this.ids.length && this.better(r, b)) b = r;
        if (b === i) break;
        this.swap(i, b);
        i = b;
      }
    }
    return top;
  }
}

/** Zusammenhängender Speicher L2-normalisierter Vektoren (gemeinsam für exakte Suche und HNSW) */
export class VectorStore {
  data: Float32Array;
  count = 0;
  constructor(readonly dims: number, capacity = 1024) {
    this.data = new Float32Array(dims * Math.max(1, capacity));
  }
  push(v: Float32Array): number {
    if (v.length !== this.dims) throw new Error(`Vektor hat ${v.length} statt ${this.dims} Dimensionen`);
    if (this.data.length < (this.count + 1) * this.dims) {
      const grown = new Float32Array(this.data.length * 2);
      grown.set(this.data);
      this.data = grown;
    }
    this.data.set(v, this.count * this.dims);
    return this.count++;
  }
  vector(id: number) {
    return this.data.subarray(id * this.dims, (id + 1) * this.dims);
  }
  sim(id: number, q: Float32Array) {
    const d = this.dims;
    const o = id * d;
    const data = this.data;
    let s = 0;
    for (let i = 0; i < d; i++) s += data[o + i] * q[i];
    return s;
  }
  /** Exakte Suche (vollständiger Durchlauf) mit Filter */
  exact(q: Float32Array, k: number, accept?: (id: number) => boolean): Neighbor[] {
    const top: Neighbor[] = [];
    let min = -Infinity;
    for (let id = 0; id < this.count; id++) {
      if (accept && !accept(id)) continue;
      const score = this.sim(id, q);
      if (top.length >= k && score <= min) continue;
      let i = top.length;
      top.push({ id, score });
      while (i > 0 && top[i - 1].score < score) {
        top[i] = top[i - 1];
        i--;
      }
      top[i] = { id, score };
      if (top.length > k) top.pop();
      min = top.length >= k ? top[top.length - 1].score : -Infinity;
    }
    return top;
  }
}

export class Hnsw {
  readonly M: number;
  readonly dims: number;
  readonly M0: number;
  readonly efConstruction: number;
  private readonly mL: number;
  /** links[knoten][ebene] = Nachbarn */
  private links: number[][][] = [];
  private entry = -1;
  private maxLevel = -1;
  private rng: number;
  private visited = new Uint32Array(0);
  private stamp = 0;

  private inserted = 0;
  /** identische Vektoren: ein Graphknoten, weitere IDs als Aliase (sonst entstehen Plateaus, auf denen die Suche hängen bleibt) */
  private readonly canonical = new Map<number, number[]>();
  private readonly aliases = new Map<number, number[]>();
  constructor(readonly store: VectorStore, opts: HnswOptions = {}) {
    this.dims = store.dims;
    this.M = opts.M ?? 12;
    this.M0 = this.M * 2;
    this.efConstruction = opts.efConstruction ?? 64;
    this.mL = 1 / Math.log(this.M);
    this.rng = opts.seed ?? 42;
  }

  /** Anzahl eingefügter Knoten (Knoten-ID = Position im VectorStore) */
  get size() {
    return this.inserted;
  }

  private random() {
    // xorshift32
    let x = this.rng;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.rng = x >>> 0;
    return (this.rng + 1) / 4294967297;
  }

  private sim(a: number, q: Float32Array) {
    return this.store.sim(a, q);
  }

  private vector(id: number) {
    return this.store.vector(id);
  }

  private nextStamp() {
    if (this.visited.length < this.inserted) {
      const v = new Uint32Array(Math.max(this.inserted, this.visited.length * 2, 1024));
      v.set(this.visited);
      this.visited = v;
    }
    if (++this.stamp === 0xffffffff) {
      this.visited.fill(0);
      this.stamp = 1;
    }
    return this.stamp;
  }

  /** Beste Kandidaten einer Ebene (Algorithmus 2 im Artikel) */
  private searchLayer(q: Float32Array, entries: Neighbor[], ef: number, level: number): Heap {
    const stamp = this.nextStamp();
    const candidates = new Heap(true);
    const results = new Heap(false); // schlechtester oben
    for (const e of entries) {
      this.visited[e.id] = stamp;
      candidates.push(e.id, e.score);
      results.push(e.id, e.score);
    }
    while (candidates.size) {
      const c = candidates.pop();
      if (results.size >= ef && c.score < results.topScore()) break;
      for (const n of this.links[c.id][level] ?? []) {
        if (this.visited[n] === stamp) continue;
        this.visited[n] = stamp;
        const s = this.sim(n, q);
        if (results.size < ef || s > results.topScore()) {
          candidates.push(n, s);
          results.push(n, s);
          if (results.size > ef) results.pop();
        }
      }
    }
    return results;
  }

  /** Nachbarauswahl mit Heuristik (Algorithmus 4): bevorzugt Nachbarn in unterschiedlichen Richtungen */
  private select(candidates: Neighbor[], m: number): number[] {
    candidates.sort((a, b) => b.score - a.score);
    const out: number[] = [];
    const skipped: number[] = [];
    for (const c of candidates) {
      if (out.length >= m) break;
      const v = this.vector(c.id);
      // behalten, wenn der Kandidat der Anfrage näher ist als jedem bereits gewählten Nachbarn
      if (out.every((o) => this.sim(o, v) < c.score)) out.push(c.id);
      else skipped.push(c.id);
    }
    for (const s of skipped) {
      if (out.length >= m) break;
      out.push(s);
    }
    return out;
  }

  private hash(id: number) {
    const v = this.store.vector(id);
    const bits = new Uint32Array(v.buffer, v.byteOffset, v.length);
    let h = 0x811c9dc5;
    for (let i = 0; i < bits.length; i++) h = Math.imul(h ^ bits[i], 0x01000193);
    return h >>> 0;
  }

  private same(a: number, b: number) {
    const x = this.store.vector(a);
    const y = this.store.vector(b);
    for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
    return true;
  }

  /** Nächsten Vektor des Stores einfügen (Reihenfolge = Store-Position) */
  insertNext(): number {
    if (this.inserted >= this.store.count) throw new Error('Kein weiterer Vektor im Store');
    const id = this.inserted++;
    const h = this.hash(id);
    const twin = this.canonical.get(h)?.find((c) => this.same(c, id));
    if (twin !== undefined) {
      this.links[id] = [];
      const list = this.aliases.get(twin);
      if (list) list.push(id);
      else this.aliases.set(twin, [id]);
      return id;
    }
    const bucket = this.canonical.get(h);
    if (bucket) bucket.push(id);
    else this.canonical.set(h, [id]);
    const level = Math.floor(-Math.log(this.random()) * this.mL);
    this.links[id] = Array.from({ length: level + 1 }, () => []);
    if (this.entry < 0) {
      this.entry = id;
      this.maxLevel = level;
      return id;
    }
    const q = this.vector(id);
    let ep: Neighbor[] = [{ id: this.entry, score: this.sim(this.entry, q) }];
    for (let l = this.maxLevel; l > level; l--) {
      const r = this.searchLayer(q, ep, 1, l);
      ep = [{ id: r.topId(), score: r.topScore() }];
    }
    for (let l = Math.min(level, this.maxLevel); l >= 0; l--) {
      const heap = this.searchLayer(q, ep, this.efConstruction, l);
      const found: Neighbor[] = heap.ids.map((n, i) => ({ id: n, score: heap.s[i] }));
      const m = l === 0 ? this.M0 : this.M;
      const neighbors = this.select(found, this.M);
      this.links[id][l] = neighbors;
      for (const n of neighbors) {
        const list = this.links[n][l];
        list.push(id);
        if (list.length > m) {
          // Rückverweise: die m ähnlichsten behalten (günstiger als die Heuristik, kaum Einfluss auf die Trefferquote)
          const nv = this.vector(n);
          this.links[n][l] = list.map((x) => ({ id: x, score: this.sim(x, nv) })).sort((a, b) => b.score - a.score).slice(0, m).map((x) => x.id);
        }
      }
      ep = found;
    }
    if (level > this.maxLevel) {
      this.maxLevel = level;
      this.entry = id;
    }
    return id;
  }

  /** k nächste Nachbarn; `accept` filtert Treffer (gelöschte/fremde Knoten), ohne die Graphsuche einzuschränken */
  search(q: Float32Array, k: number, ef = Math.max(100, k * 4), accept?: (id: number) => boolean): Neighbor[] {
    if (this.entry < 0) return [];
    let ep: Neighbor[] = [{ id: this.entry, score: this.sim(this.entry, q) }];
    for (let l = this.maxLevel; l > 0; l--) {
      const r = this.searchLayer(q, ep, 1, l);
      ep = [{ id: r.topId(), score: r.topScore() }];
    }
    const heap = this.searchLayer(q, ep, Math.max(ef, k), 0);
    const order = heap.ids.map((id, i) => ({ id, score: heap.s[i] })).sort((a, b) => b.score - a.score);
    const out: Neighbor[] = [];
    for (const n of order) {
      for (const id of [n.id, ...(this.aliases.get(n.id) ?? [])]) {
        if (!accept || accept(id)) out.push({ id, score: n.score });
        if (out.length >= k) return out;
      }
    }
    return out;
  }
}
