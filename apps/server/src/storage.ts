// Object-Storage-Abstraktion (ADR-008). Schlüssel = SHA-256 bzw. eindeutige IDs → Inhalte werden nie überschrieben.
// Implementierungen: lokales Dateisystem (Einzelinstanz) und S3-kompatibler Speicher (Mehrinstanzbetrieb).
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'node:fs';
import path from 'node:path';

export interface ObjectStore {
  readonly kind: 'local' | 's3';
  /** Legt ein Objekt an. Existiert der Schlüssel bereits, bleibt das vorhandene Objekt unverändert. */
  put(key: string, data: Buffer): Promise<void>;
  get(key: string): Promise<Buffer>;
  exists(key: string): Promise<boolean>;
}

export class ObjectNotFoundError extends Error {
  constructor(key: string) {
    super(`Objekt ${key} nicht gefunden`);
  }
}

function assertKey(key: string) {
  if (!/^[a-z0-9/_.-]+$/i.test(key) || key.includes('..') || key.startsWith('/')) throw new Error(`Ungültiger Objektschlüssel: ${key}`);
}

export class LocalObjectStore implements ObjectStore {
  readonly kind = 'local' as const;
  constructor(private readonly root: string) {
    fs.mkdirSync(root, { recursive: true });
  }
  private file(key: string) {
    assertKey(key);
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
    return fs.promises.readFile(this.file(key)).catch((e) => {
      throw e.code === 'ENOENT' ? new ObjectNotFoundError(key) : e;
    });
  }
  async exists(key: string) {
    return fs.existsSync(this.file(key));
  }
}

export interface S3StoreOptions {
  bucket: string;
  /** Präfix innerhalb des Buckets, z. B. `onescm/` */
  prefix?: string;
  region?: string;
  /** Endpunkt für S3-kompatible Speicher (MinIO, Ceph, …) */
  endpoint?: string;
  forcePathStyle?: boolean;
  credentials?: { accessKeyId: string; secretAccessKey: string };
  client?: S3Client;
}

const statusOf = (e: any): number | undefined => e?.$metadata?.httpStatusCode;

export class S3ObjectStore implements ObjectStore {
  readonly kind = 's3' as const;
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly prefix: string;

  constructor(opts: S3StoreOptions) {
    this.bucket = opts.bucket;
    this.prefix = opts.prefix ? opts.prefix.replace(/^\/+|\/+$/g, '') + '/' : '';
    // Zugangsdaten ohne explizite Angabe über die Standardkette des AWS-SDK (Umgebung, Instanzrolle, …)
    this.client =
      opts.client ??
      new S3Client({
        region: opts.region ?? 'us-east-1',
        ...(opts.endpoint ? { endpoint: opts.endpoint } : {}),
        forcePathStyle: opts.forcePathStyle ?? !!opts.endpoint,
        ...(opts.credentials ? { credentials: opts.credentials } : {}),
      });
  }

  private objectKey(key: string) {
    assertKey(key);
    return this.prefix + key;
  }

  async exists(key: string) {
    try {
      await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: this.objectKey(key) }));
      return true;
    } catch (e) {
      if (statusOf(e) === 404 || (e as Error).name === 'NotFound') return false;
      throw e;
    }
  }

  async put(key: string, data: Buffer) {
    if (await this.exists(key)) return;
    try {
      // IfNoneMatch: bedingtes Schreiben – ein paralleles Anlegen desselben Schlüssels überschreibt nicht
      await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: this.objectKey(key), Body: data, IfNoneMatch: '*' }));
    } catch (e) {
      const status = statusOf(e);
      if (status === 412 || status === 409) return; // existiert bereits (Race) → unverändert lassen
      // Speicher ohne bedingtes Schreiben: Existenz wurde oben per HEAD geprüft
      if (status === 501) {
        await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: this.objectKey(key), Body: data }));
        return;
      }
      throw e;
    }
  }

  async get(key: string) {
    try {
      const res = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: this.objectKey(key) }));
      return Buffer.from(await res.Body!.transformToByteArray());
    } catch (e) {
      if (statusOf(e) === 404 || (e as Error).name === 'NoSuchKey') throw new ObjectNotFoundError(key);
      throw e;
    }
  }
}
