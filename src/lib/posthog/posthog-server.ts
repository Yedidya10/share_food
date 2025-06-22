import { PostHog } from "posthog-node";

let posthogInstance: PostHog | null = null;

export function getPostHogServer() {
  // Use a secure, server-only environment variable
  const apiKey = process.env.POSTHOG_API_KEY;
  if (!apiKey) {
    throw new Error(
      "POSTHOG_API_KEY is not set. Please set it in your server environment variables."
    );
  }
  if (!posthogInstance) {
    posthogInstance = new PostHog(apiKey, {
      host: "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0, // Because server-side functions in Next.js can be short-lived we flush regularly
    });
  }
  return posthogInstance;
}
