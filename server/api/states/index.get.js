import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const states = await prisma.state.findMany()
    return states
  } catch (error) {
    console.error('Error fetching states:', error)
    return { error: 'Failed to fetch states' }
  }
})