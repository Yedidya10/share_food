import { PostHog } from "posthog-node";

let posthogInstance: PostHog | null = null;

export function getPostHogServer() {
  if (!posthogInstance) {
    posthogInstance = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
      host: "https://us.i.posthog.com",
      flushAt: 1,
      flushInterval: 0, // Because server-side functions in Next.js can be short-lived we flush regularly
    });
  }
  return posthogInstance;
}
