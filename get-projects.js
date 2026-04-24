const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const projects = await prisma.devProject.findMany();
  console.log(projects.map(p => ({title: p.title, link: p.link})));
}
main().catch(console.error).finally(() => prisma.$disconnect());
