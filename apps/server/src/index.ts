import { buildApp } from './app.js';

const { app, ctx } = await buildApp();
await app.listen({ port: ctx.config.port, host: ctx.config.host });
for (const sig of ['SIGINT', 'SIGTERM'] as const) process.on(sig, () => void app.close().then(() => process.exit(0)));
