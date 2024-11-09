import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const newTournament = await prisma.tournament.create({
      data: {
        name: body.name,
        tableCount: body.tableCount || 0
      }
    })
    return newTournament
  } catch (error) {
    console.error('Error creating tournament:', error)
    return { error: 'Failed to create tournament' }
  }
})