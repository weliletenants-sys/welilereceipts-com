import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const phone = '256777777777';
  const passwordRaw = 'Password123!';
  const passwordHash = await bcrypt.hash(passwordRaw, 10);

  let profile = await prisma.profiles.findFirst({
    where: { phone }
  });

  if (profile) {
    profile = await prisma.profiles.update({
      where: { id: profile.id },
      data: {
        password_hash: passwordHash,
        role: 'TENANT' // Or whatever default is needed
      }
    });
    console.log(`Updated user ${phone} with new password.`);
  } else {
    profile = await prisma.profiles.create({
      data: {
        phone,
        password_hash: passwordHash,
        full_name: 'Test User',
        email: 'test777@welile.com',
        role: 'TENANT',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        verified: true,
        is_frozen: false,
        rent_discount_active: false
      }
    });
    console.log(`Created user ${phone} with new password.`);
  }

  // Ensure they have a userRole record
  const role = await prisma.userRoles.findFirst({
    where: { user_id: profile.id }
  });

  if (!role) {
    await prisma.userRoles.create({
      data: {
        user_id: profile.id,
        role: 'TENANT',
        enabled: true,
        created_at: new Date().toISOString()
      }
    });
    console.log(`Assigned TENANT role to ${phone}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
