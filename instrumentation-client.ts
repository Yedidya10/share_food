// import posthog from "posthog-js";
// import { externalServices, isDev } from '@/lib/envConfig'

// if (typeof window !== "undefined") {
//   const posthogKey = externalServices.posthog.apiKey;
//   if (posthogKey) {
//     posthog.init(posthogKey, {
//       api_host: "https://us.posthog.com",
//       ui_host: "https://us.posthog.com",
//       capture_pageview: "history_change",
//       capture_pageleave: true,
//       capture_exceptions: true,
//       autocapture: true,
//       // debug: isDev,
//     });
//   } else {
//     if (isDev) {
//       // Optionally log a warning in development
//       console.warn(
//         "PostHog API key is missing. Analytics will not be initialized."
//       );
//     }
//   }
// }
