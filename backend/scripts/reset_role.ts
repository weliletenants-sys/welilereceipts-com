import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const u = await prisma.profiles.findFirst({ where: { phone: '256777777777' } });
  if(!u) return console.log('no user');
  
  // Update the userRoles table
  await prisma.userRoles.updateMany({
    where: { user_id: u.id },
    data: { role: 'TENANT' }
  });
  
  // Also update the profile role just in case
  await prisma.profiles.update({
    where: { id: u.id },
    data: { role: 'TENANT' }
  });
  
  console.log('Role reset to TENANT successfully.');
}
main().finally(() => prisma.$disconnect());
