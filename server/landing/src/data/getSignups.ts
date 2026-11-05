import type { Context } from 'hono'
import type { AppEnv } from '../types'

export const getSignups = (c: Context<AppEnv>) => c.env.SIGNUPS
