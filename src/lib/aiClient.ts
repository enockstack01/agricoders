import axios from "axios";

/**
 * Returns the message to show when a request was refused by the AI rate limiter (HTTP 429),
 * or null for any other error. Handles blob responses, which downloads use.
 */
export async function rateLimitMessage(err: unknown): Promise<string | null> {
  if (!axios.isAxiosError(err) || err.response?.status !== 429) return null;
  let data: unknown = err.response.data;
  if (typeof Blob !== "undefined" && data instanceof Blob) {
    try {
      data = JSON.parse(await data.text());
    } catch {
      data = null;
    }
  }
  const message = (data as { message?: string } | null)?.message;
  return message ?? "You have reached the AI usage limit. Please try again later.";
}
