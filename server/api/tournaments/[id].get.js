import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  
  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        tables: {
          include: {
            state: true
          },
          orderBy: {
            number: 'asc'
          }
        }
      }
    })
    return tournament
  } catch (error) {
    console.error('Error fetching tournament:', error)
    return { error: 'Failed to fetch tournament' }
  }
})