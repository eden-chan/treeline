import { bucket } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  transform: {
    route: {
      handler: {
        link: [bucket],
      },
    }
  }
});

api.route("GET /", {
  link: [bucket],
  handler: "packages/functions/src/api.hello",
});

api.route("POST /", {
  link: [bucket],
  handler: "packages/functions/src/api.youtubeTranscript",
  nodejs: {
    install: ["node-fetch"]
  }
});
