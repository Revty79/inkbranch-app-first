export interface ServerConfig {
  port: number;
  nodeEnv: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  const port = Number(env.PORT ?? 4000);

  return {
    port: Number.isFinite(port) ? port : 4000,
    nodeEnv: env.NODE_ENV ?? "development"
  };
}
