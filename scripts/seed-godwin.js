const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('godwin@2007', 10);
  const user = await prisma.user.upsert({
    where: { email: 'godwin6945@gmail.com' },
    update: { role: 'ADMIN', passwordHash: hash },
    create: {
      email: 'godwin6945@gmail.com',
      name: 'Godwin (VS Engineering Works)',
      role: 'ADMIN',
      phone: '9345804547',
      passwordHash: hash,
    },
  });
  console.log('✅ Admin user ensured in Neon:', user.email, user.role);
}

main()
  .catch((err) => {
    console.error('Error seeding admin:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
