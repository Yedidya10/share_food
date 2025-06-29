"use client"

import {use} from "react"
import { createClient } from "@/lib/supabase/client"
import posthog from "posthog-js"

export default function PosthogIdentify() {
  const supabase = createClient()
  const { data: {user}, error } = use(supabase.auth.getUser())

  if (error) {
    console.error("Error fetching user data:", error)
    return null
  }

  if (user === null) {
    console.warn("No user data found")
    return null
  }

  posthog.identify(user?.id, {
    email: user.email,
    fullName: user.user_metadata?.full_name,
    firstName: user.user_metadata?.full_name?.split(" ")[0],
    lastName: user.user_metadata?.full_name?.split(" ")[1],
  })
}