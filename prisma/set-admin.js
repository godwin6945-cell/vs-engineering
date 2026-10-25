const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setAdmin() {
  const hash = await bcrypt.hash('godwin@2007', 10);
  
  // Upsert godwin6945@gmail.com as ADMIN
  const user = await prisma.user.upsert({
    where: { email: 'godwin6945@gmail.com' },
    update: { 
      role: 'ADMIN', 
      passwordHash: hash,
      name: 'Godwin (VS Engineering Works)',
      phone: '9345804547'
    },
    create: {
      email: 'godwin6945@gmail.com',
      name: 'Godwin (VS Engineering Works)',
      role: 'ADMIN',
      passwordHash: hash,
      phone: '9345804547'
    }
  });

  console.log('✅ Admin account verified:');
  console.log(`- ${user.email} (ADMIN)`);
}

setAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
