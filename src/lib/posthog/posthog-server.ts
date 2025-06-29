import { PostHog } from 'posthog-node'
import { externalServices } from '@/lib/envConfig'

let posthogInstance: PostHog | null = null

export default function getPostHogServer() {
  if (!posthogInstance) {
    posthogInstance = new PostHog(externalServices.posthog.apiKey, {
      host: 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0, // Because server-side functions in Next.js can be short-lived we flush regularly
    })
  }
  return posthogInstance
}
