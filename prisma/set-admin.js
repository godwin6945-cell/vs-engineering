const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setAdmin() {
  const hash = await bcrypt.hash('AdminPassword123!', 10);
  
  // Upsert godwin6945@gmail.com as ADMIN
  const user1 = await prisma.user.upsert({
    where: { email: 'godwin6945@gmail.com' },
    update: { 
      role: 'ADMIN', 
      passwordHash: hash,
      name: 'Godwin S (Admin)',
      phone: '9345804547'
    },
    create: {
      email: 'godwin6945@gmail.com',
      name: 'Godwin S (Admin)',
      role: 'ADMIN',
      passwordHash: hash,
      phone: '9345804547'
    }
  });

  // Upsert admin@vsengineering.com as ADMIN
  const user2 = await prisma.user.upsert({
    where: { email: 'admin@vsengineering.com' },
    update: { 
      role: 'ADMIN', 
      passwordHash: hash,
      name: 'VS Engineering Admin'
    },
    create: {
      email: 'admin@vsengineering.com',
      name: 'VS Engineering Admin',
      role: 'ADMIN',
      passwordHash: hash
    }
  });

  console.log('Successfully set ADMIN accounts:');
  console.log('- godwin6945@gmail.com (ADMIN)');
  console.log('- admin@vsengineering.com (ADMIN)');
  console.log('Default initial password: AdminPassword123!');
}

setAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
