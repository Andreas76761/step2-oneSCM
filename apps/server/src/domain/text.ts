/** Sonderzeichen eines regulären Ausdrucks maskieren, damit ein Begriff wörtlich gesucht wird */
export const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
