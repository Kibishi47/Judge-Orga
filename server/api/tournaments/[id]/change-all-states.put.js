import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const body = await readBody(event)
  
  try {
    // First update all tables for this tournament
    await prisma.table.updateMany({
      where: {
        tournamentId: id
      },
      data: {
        stateId: body.stateId
      }
    })

    // Then fetch the updated tournament with tables
    const updatedTournament = await prisma.tournament.findUnique({
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
    
    return updatedTournament
  } catch (error) {
    console.error('Error updating all table states:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update all table states'
    })
  }
})