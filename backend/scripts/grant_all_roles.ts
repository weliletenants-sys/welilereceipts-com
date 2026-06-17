import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const u = await prisma.profiles.findFirst({ where: { phone: '256777777777' } });
  if(!u) return console.log('no user');
  
  const roles = ['TENANT', 'AGENT', 'LANDLORD', 'FUNDER', 'SUPPORTER', 'MANAGER', 'SUPER_ADMIN'];
  
  for (const role of roles) {
    const existing = await prisma.userRoles.findFirst({
      where: { user_id: u.id, role }
    });
    if (!existing) {
      await prisma.userRoles.create({
        data: {
          user_id: u.id,
          role,
          enabled: true,
          created_at: new Date().toISOString()
        }
      });
      console.log(`Granted ${role}`);
    } else {
      await prisma.userRoles.update({
        where: { id: existing.id },
        data: { enabled: true }
      });
      console.log(`Enabled ${role}`);
    }
  }
  
  console.log('All roles granted successfully.');
}
main().finally(() => prisma.$disconnect());
