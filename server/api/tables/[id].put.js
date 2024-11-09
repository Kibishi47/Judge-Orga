import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id)
  const body = await readBody(event)
  
  try {
    const updatedTable = await prisma.table.update({
      where: { id },
      data: { stateId: body.stateId },
      include: { state: true }
    })
    return updatedTable
  } catch (error) {
    console.error('Error updating table:', error)
    return { error: 'Failed to update table' }
  }
})