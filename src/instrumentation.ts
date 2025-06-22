export function register() {
  // No-op for initialization
}

// Helper to parse cookies from a string
function getCookieValue(
  cookieString: string,
  name: string
): string | undefined {
  return cookieString
    .split(";")
    .map((c: string) => c.trim())
    .find((c: string) => c.startsWith(name + "="))
    ?.split("=")[1];
}

// @ts-expect-error. This function is used to capture errors in server-side requests
export const onRequestError = async (err, request) => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getPostHogServer } = await import("./lib/posthog/posthog-server");
    const posthog = getPostHogServer();

    let distinctId = null;
    if (request.headers.cookie) {
      const cookieString = request.headers.cookie;
      // Find the first cookie that starts with 'ph_phc_' and ends with '_posthog'
      const phCookieName = cookieString
        .split(";")
        .map((c: string) => c.trim().split("=")[0])
        .find(
          (name: string) =>
            name.startsWith("ph_phc_") && name.endsWith("_posthog")
        );
      if (phCookieName) {
        const cookieValue = getCookieValue(cookieString, phCookieName);
        if (cookieValue) {
          try {
            const decodedCookie = decodeURIComponent(cookieValue);
            const postHogData = JSON.parse(decodedCookie);
            distinctId = postHogData.distinct_id;
          } catch (e) {
            console.error("Error parsing PostHog cookie:", e);
          }
        }
      }
    }

    await posthog.captureException(err, distinctId || undefined);
  }
};
