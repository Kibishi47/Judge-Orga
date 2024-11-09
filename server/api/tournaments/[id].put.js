import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const body = await readBody(event)
  
  try {
    // Update tournament
    const tournament = await prisma.tournament.update({
      where: { id },
      data: { tableCount: body.tableCount }
    })

    // Get current tables
    const currentTables = await prisma.table.findMany({
      where: { tournamentId: id }
    })

    // Get the "Free" state
    const freeState = await prisma.state.findFirst({
      where: { name: 'Free' }
    })

    // Add new tables if needed
    if (body.tableCount > currentTables.length) {
      const newTables = []
      for (let i = currentTables.length + 1; i <= body.tableCount; i++) {
        newTables.push({
          number: i,
          tournamentId: id,
          stateId: freeState.id
        })
      }
      await prisma.table.createMany({
        data: newTables
      })
    }
    // Remove excess tables if needed
    else if (body.tableCount < currentTables.length) {
      await prisma.table.deleteMany({
        where: {
          tournamentId: id,
          number: {
            gt: body.tableCount
          }
        }
      })
    }

    // Return updated tournament with tables
    return await prisma.tournament.findUnique({
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
  } catch (error) {
    console.error('Error updating tournament:', error)
    return { error: 'Failed to update tournament' }
  }
})