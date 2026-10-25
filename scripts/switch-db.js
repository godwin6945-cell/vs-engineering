const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const target = (process.argv[2] || '').toLowerCase();
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

if (!['postgres', 'postgresql', 'sqlite'].includes(target)) {
  console.log('Usage: node scripts/switch-db.js [postgres|sqlite]');
  process.exit(1);
}

let content = fs.readFileSync(schemaPath, 'utf8');

if (target.startsWith('postgres')) {
  content = content.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  console.log(' Switched prisma/schema.prisma provider to "postgresql" for Neon/Supabase/Vercel.');
} else {
  content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  console.log(' Switched prisma/schema.prisma provider to "sqlite" for local development.');
}

fs.writeFileSync(schemaPath, content, 'utf8');

try {
  console.log(' Regenerating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log(' Prisma client updated successfully.');
} catch (err) {
  console.error('Failed to regenerate prisma client:', err.message);
}
