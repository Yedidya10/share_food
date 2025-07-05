'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { User } from '@supabase/supabase-js'

export default async function getListUsers(
  page: number = 1, // Default to page 1
  perPage: number = 1, // Default to 10 users per page
): Promise<{
  data?: {
    users: User[]
    total: number
  }
  error?: {
    code?: string
    message?: string
  }
}> {
  try {
    const { data: usersData, error: usersError } =
      await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      })

    if (usersError) {
      console.error(usersError.code, usersError.message)
      if (usersError.code === 'not_admin') {
        return {
          error: {
            code: usersError.code,
            message: usersError.message,
          },
        }
      }
      return {
        error: {
          code: 'unexpected_error',
          message: 'Failed to load users. Please try again later.',
        },
      }
    }

    const users: User[] = usersData?.users || []
    const total = usersData?.total || 0

    return {
      data: {
        users,
        total,
      },
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return {
      error: {
        code: 'unexpected_error',
        message: 'An unexpected error occurred while fetching users.',
      },
    }
  }
}
