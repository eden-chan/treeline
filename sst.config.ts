/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "treeline",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
  
await import("./infra/storage");
    const api = await import("./infra/api");

    return {
      api: api.api.url,
    };
  },
});
