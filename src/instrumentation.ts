// instrumentation.js

export function register() {
  // No-op for initialization
}

// @ts-expect-error. This function is used to capture errors in server-side requests
export const onRequestError = async (err, request) => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getPostHogServer } = await import("./lib/posthog/posthog-server");
    const posthog = getPostHogServer();

    let distinctId = null;
    if (request.headers.cookie) {
      const cookieString = request.headers.cookie;
      const postHogCookieMatch = cookieString.match(
        /ph_phc_.*?_posthog=([^;]+)/
      );

      if (postHogCookieMatch && postHogCookieMatch[1]) {
        try {
          const decodedCookie = decodeURIComponent(postHogCookieMatch[1]);
          const postHogData = JSON.parse(decodedCookie);
          distinctId = postHogData.distinct_id;
        } catch (e) {
          console.error("Error parsing PostHog cookie:", e);
        }
      }
    }

    await posthog.captureException(err, distinctId || undefined);
  }
};
