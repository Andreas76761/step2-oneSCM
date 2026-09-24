// Object-Storage-Abstraktion (ADR-008). Schlüssel = SHA-256 → Inhalte werden nie überschrieben.
import fs from 'node:fs';
import path from 'node:path';

export interface ObjectStore {
  put(key: string, data: Buffer): Promise<void>;
  get(key: string): Promise<Buffer>;
  exists(key: string): Promise<boolean>;
}

export class LocalObjectStore implements ObjectStore {
  constructor(private readonly root: string) {
    fs.mkdirSync(root, { recursive: true });
  }
  private file(key: string) {
    if (!/^[a-z0-9/_.-]+$/i.test(key) || key.includes('..')) throw new Error(`Ungültiger Objektschlüssel: ${key}`);
    return path.join(this.root, key);
  }
  async put(key: string, data: Buffer) {
    const f = this.file(key);
    if (fs.existsSync(f)) return; // unveränderlich: vorhandene Objekte werden nicht überschrieben
    fs.mkdirSync(path.dirname(f), { recursive: true });
    await fs.promises.writeFile(f, data, { flag: 'wx' }).catch((e) => {
      if (e.code !== 'EEXIST') throw e;
    });
  }
  async get(key: string) {
    return fs.promises.readFile(this.file(key));
  }
  async exists(key: string) {
    return fs.existsSync(this.file(key));
  }
}
