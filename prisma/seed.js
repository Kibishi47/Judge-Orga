const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const states = [
    { name: 'Free', color: 'bg-green-300 hover:bg-green-400' },
    { name: 'Occupied', color: 'bg-yellow-300 hover:bg-yellow-400' },
    { name: 'Finished', color: 'bg-red-300 hover:bg-red-400' }
  ]

  for (const state of states) {
    await prisma.state.upsert({
      where: { name: state.name },
      update: { color: state.color },
      create: state,
    })
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())