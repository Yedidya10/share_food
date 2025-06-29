// app/api/posthog/[...path]/route.ts
import { NextRequest } from 'next/server'

const UPSTREAM = 'https://us.posthog.com'

export async function GET(req: NextRequest) {
  return proxy(req)
}

export async function POST(req: NextRequest) {
  return proxy(req)
}

async function proxy(req: NextRequest) {
  try {
    const { pathname, search } = new URL(req.url)
    const relativePath = pathname.replace(/^\/api\/posthog/, '')
    const upstreamUrl = `${UPSTREAM}${relativePath}${search}`

    console.log(`🔁 Proxying to: ${upstreamUrl}`)

    const headers = new Headers(req.headers)
    headers.delete('host')
    headers.delete('content-length')

    const res = await fetch(upstreamUrl, {
      method: req.method,
      headers,
      body: req.method === 'POST' ? req.body : undefined,
      redirect: 'manual',
    })

    console.log(`✅ Upstream response: ${res.status} ${res.statusText}`)

    return new Response(res.body, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'application/json',
      },
    })
  } catch (err) {
    console.error('❌ Proxy error:', err)
    return new Response(
      JSON.stringify({
        error: 'Proxy failed',
        details: err,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
