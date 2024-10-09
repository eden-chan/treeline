import { injectable } from "inversify";
import { YoutubeTranscript } from "./youtubeTranscript";


export const IYoutubeService = "youtubeService";

export interface IYoutubeService {
  getTranscript(url: string): Promise<string | null>;
  startTranscriptPrecalculation(): void;
}

@injectable()
export class YoutubeService implements IYoutubeService {
  private currentVideoId: string | null = null;
  private transcriptCache: Map<string, string> = new Map();

  constructor() {
    this.startTranscriptPrecalculation();
  }

  async getTranscript(url: string): Promise<string | null> {
    try {
      const videoId = YoutubeTranscript.retrieveVideoId(url);
  

      if (this.transcriptCache.has(videoId)) {
    
        return this.transcriptCache.get(videoId) ?? null;
      }

      return await this.fetchAndProcessTranscript(videoId);
    } catch (error) {
      console.error(
        "[YoutubeService] Error fetching YouTube transcript:",
        error
      );
      return null;
    }
  }

  private async fetchAndProcessTranscript(
    videoId: string
  ): Promise<string | null> {
    const transcript = await YoutubeTranscript.fetchTranscriptIfAvailable(
      videoId
    );
    if (!transcript) return null;

    let result = "";
    let lastTimestamp = -20;

    for (const entry of transcript) {
      const currentTimestamp = Math.floor(entry.offset);
      if (currentTimestamp - lastTimestamp >= 10) {
        result += `[${entry.timestamp}]\n`;
        lastTimestamp = currentTimestamp;
      }
      result += `${entry.text}\n`;
    }

    const processedTranscript = result.trim();
    this.transcriptCache.set(videoId, processedTranscript);
    return processedTranscript;
  }

  startTranscriptPrecalculation(): void {
    console.log("[YoutubeService] Starting transcript precalculation");

    const checkForVideoChange = () => {
      const videoId = this.getCurrentVideoId();
      if (videoId && videoId !== this.currentVideoId) {
        console.log(`[YoutubeService] Video changed to ${videoId}`);
        this.currentVideoId = videoId;
        this.fetchAndProcessTranscript(videoId);
      }
    };

    // Check for video changes every second
    setInterval(checkForVideoChange, 1000);

    // Also check on history state changes (for SPA navigation)
    window.addEventListener("popstate", checkForVideoChange);

    // Intercept pushState and replaceState calls
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args: Parameters<typeof originalPushState>) {
      originalPushState.apply(this, args);
      checkForVideoChange();
    };

    history.replaceState = function (...args: Parameters<typeof originalReplaceState>) {
      originalReplaceState.apply(this, args);
      checkForVideoChange();
    };
  }

  private getCurrentVideoId(): string | null {
    const url = window.location.href;
    try {
      return YoutubeTranscript.retrieveVideoId(url);
    } catch {
      return null;
    }
  }
}
