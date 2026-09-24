// Minimale Typen für den S3-Testserver (nur in Tests verwendet)
declare module 's3rver' {
  interface S3rverOptions {
    port?: number;
    address?: string;
    silent?: boolean;
    directory: string;
    configureBuckets?: { name: string }[];
  }
  export default class S3rver {
    constructor(options: S3rverOptions);
    run(): Promise<unknown>;
    close(): Promise<void>;
  }
}
