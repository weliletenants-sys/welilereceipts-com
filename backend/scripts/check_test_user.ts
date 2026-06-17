import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const u = await prisma.profiles.findFirst({ where: { phone: '256777777777' } });
  if(!u) return console.log('no user');
  const r = await prisma.userRoles.findMany({ where: { user_id: u.id } });
  console.log('role field:', u.role, 'userRoles:', r);
}
main().finally(() => prisma.$disconnect());
