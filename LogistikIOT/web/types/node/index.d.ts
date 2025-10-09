declare var process: {
  env: Record<string, string | undefined>;
};

declare var __dirname: string;

declare module "node:process" {
  export = process;
}
