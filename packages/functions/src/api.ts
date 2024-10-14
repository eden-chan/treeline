import { Resource } from "sst";
import type { Handler } from "aws-lambda";
import fetch from "node-fetch";

export const hello: Handler = async (_event) => {
  console.log(Resource.App.name, "event", _event);
  return {
    statusCode: 200,
    body: `Linked to ${Resource.App.name}. hello`,
  };
};

export const youtubeTranscript: Handler = async (_event) => {
  console.log(Resource.App.name, "POST event", _event);
  try {
    const body = JSON.parse(_event.body);
    console.log(Resource.App.name, "parsed POST event", body);
    const videoId = body.videoId;
    console.log(
      Resource.App.name,
      "making fetch request to video url",
      videoId,
    );

    const data = await fetch(`https://www.youtube.com/watch?v=${videoId}`);

    console.log(Resource.App.name, "got data from fetch request", data);
    const html = await data.text();

    const match = html.match(/"captions":(\{.*?\}),"videoDetails"/);
    if (!match) {
      throw new Error(`No caption data found  in HTML: ${html}`);
    }

    const captionsData = JSON.parse(match[1]);
    const captionTracks =
      captionsData.playerCaptionsTracklistRenderer.captionTracks;

    if (!captionTracks || captionTracks.length === 0) {
      throw new Error("No caption tracks found");
    }

    const selectedTrack = captionTracks[0];
    // if (config?.lang) {
    //   selectedTrack =
    //   // biome-ignore lint: reason
    //     captionTracks.find((track: any) => track.languageCode === config.lang) ||
    //     selectedTrack;
    // }
    const transcriptResponse = await fetch(selectedTrack.baseUrl);
    const transcriptText = await transcriptResponse.text();

    return {
      statusCode: 200,
      body: `${transcriptText}`,
    };
  } catch (error) {
    console.error(Resource.App.name, "Error parsing body", error);
    return {
      statusCode: 500,
      body: {
        message: "Error parsing body",
      },
    };
  }
};
