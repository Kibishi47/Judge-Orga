import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const tournaments = await prisma.tournament.findMany()
    console.log(tournaments);
    return tournaments
  } catch (error) {
    console.error('Error fetching tournaments:', error)
    return { error: 'Failed to fetch tournaments' }
  }
})