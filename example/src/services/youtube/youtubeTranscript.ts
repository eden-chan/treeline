const RE_YOUTUBE =
  /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
// const USER_AGENT =
//   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)";
// const RE_XML_TRANSCRIPT =
//   /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;

export class YoutubeTranscriptError extends Error {
  constructor(message: string) {
    super(`[YoutubeTranscript] 🚨 ${message}`);
  }
}

export class YoutubeTranscriptTooManyRequestError extends YoutubeTranscriptError {
  constructor() {
    super(
      "YouTube is receiving too many requests from this IP and now requires solving a captcha to continue"
    );
  }
}

export class YoutubeTranscriptVideoUnavailableError extends YoutubeTranscriptError {
  constructor(videoId: string) {
    super(`The video is no longer available (${videoId})`);
  }
}

export class YoutubeTranscriptDisabledError extends YoutubeTranscriptError {
  constructor(videoId: string) {
    super(`Transcript is disabled on this video (${videoId})`);
  }
}

export class YoutubeTranscriptNotAvailableError extends YoutubeTranscriptError {
  constructor(videoId: string) {
    super(`No transcripts are available for this video (${videoId})`);
  }
}

export class YoutubeTranscriptNotAvailableLanguageError extends YoutubeTranscriptError {
  constructor(lang: string, availableLangs: string[], videoId: string) {
    super(
      `No transcripts are available in ${lang} this video (${videoId}). Available languages: ${availableLangs.join(
        ", "
      )}`
    );
  }
}

export interface TranscriptConfig {
  lang?: string;
}
export interface TranscriptResponse {
  text: string;
  duration: number;
  offset: number;
  lang?: string;
  timestamp: string; // Add this line
}

/**
 * Class to retrieve transcript if exist
 */
export class YoutubeTranscript {
  
  private static cache: Map<string, TranscriptResponse[]> = new Map();
  public test = "test";
  public static clearCache(): void {
    // biome-ignore lint: reason
    this.cache.clear();
  }

  public static async fetchTranscript(
    videoId: string,
    config?: TranscriptConfig
  ): Promise<TranscriptResponse[]> {
    console.log(
      `[YoutubeTranscript] Fetching transcript for video ID: ${videoId}`
    );

    const cacheKey = `${videoId}_${config?.lang || "default"}`;
    // biome-ignore lint: reason
    if (this.cache.has(cacheKey)) {
      console.log(
        `[YoutubeTranscript] Returning cached transcript for ${videoId}`
      );
      // biome-ignore lint: reason
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(
        `https://www.youtube.com/watch?v=${videoId}`
      );
      const html = await response.text();

      const match = html.match(/"captions":(\{.*?\}),"videoDetails"/);
      if (!match) {
        throw new YoutubeTranscriptError("Could not find captions data");
      }

      const captionsData = JSON.parse(match[1]);
      const captionTracks =
        captionsData.playerCaptionsTracklistRenderer.captionTracks;

      if (!captionTracks || captionTracks.length === 0) {
        throw new YoutubeTranscriptNotAvailableError(videoId);
      }

      let selectedTrack = captionTracks[0];
      if (config?.lang) {
        selectedTrack =
        // biome-ignore lint: reason
          captionTracks.find((track: any) => track.languageCode === config.lang) ||
          selectedTrack;
      }

      const transcriptResponse = await fetch(selectedTrack.baseUrl);
      const transcriptText = await transcriptResponse.text();

      const transcript = YoutubeTranscript.parseTranscript(transcriptText);

      YoutubeTranscript.cache.set(cacheKey, transcript);
      return transcript;
    } catch (error) {
      console.error("[YoutubeTranscript] Error:", error);
      throw error;
    }
  }

  private static parseTranscript(xmlString: string): TranscriptResponse[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const textElements = xmlDoc.getElementsByTagName("text");

    return Array.from(textElements).map((element) => ({
      text: element.textContent || "",
      start: Number.parseFloat(element.getAttribute("start") || "0"),
      duration: Number.parseFloat(element.getAttribute("dur") || "0"),
      offset: Number.parseFloat(element.getAttribute("start") || "0"),
      // biome-ignore lint: reason
      timestamp: this.formatTimestamp(
        Number.parseFloat(element.getAttribute("start") || "0")
      ),
    }));
  }

  private static formatTimestamp(seconds: number): string {
    const date = new Date(seconds * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const secs = date.getUTCSeconds();

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
        .padStart(2, "0")}`;
    
  }

  public static retrieveVideoId(videoId: string): string {
    if (videoId.length === 11) {
      return videoId;
    }
    const matchId = videoId.match(RE_YOUTUBE);
    if (matchId?.length) {
      return matchId[1];
    }
    throw new YoutubeTranscriptError(
      "Impossible to retrieve Youtube video ID."
    );
  }

  public static async fetchTranscriptIfAvailable(
    videoId: string
  ): Promise<TranscriptResponse[] | null> {
    try {
      return await YoutubeTranscript.fetchTranscript(videoId);
    } catch (error) {
      console.warn(
        `[YoutubeTranscript] Transcript not available for video ${videoId}:`,
        error
      );
      return null;
    }
  }
}

// Add this type declaration at the top of the file
declare global {
  interface Window {
    ytplayer?: {
      config?: {
        args?: {
          player_response: string;
        };
      };
    };
  }
}
