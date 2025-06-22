import posthog from "posthog-js";

if (typeof window !== "undefined") {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: "https://us.posthog.com",
      ui_host: "https://us.posthog.com",
      capture_pageview: "history_change",
      capture_pageleave: true,
      capture_exceptions: true,
      autocapture: true,
      debug: process.env.NODE_ENV === "development",
    });
  } else {
    if (process.env.NODE_ENV === "development") {
      // Optionally log a warning in development
      console.warn(
        "PostHog API key is missing. Analytics will not be initialized."
      );
    }
  }
}
