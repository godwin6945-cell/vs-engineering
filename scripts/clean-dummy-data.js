const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDummyData() {
  console.log('🧹 Purging dummy data from database...');

  // 1. Delete dispatch details
  const deletedDispatch = await prisma.dispatchDetail.deleteMany({});
  console.log(`- Deleted ${deletedDispatch.count} dispatch records`);

  // 2. Delete order photos
  const deletedPhotos = await prisma.orderPhoto.deleteMany({});
  console.log(`- Deleted ${deletedPhotos.count} order photos`);

  // 3. Delete order status histories
  const deletedHistories = await prisma.orderStatusHistory.deleteMany({});
  console.log(`- Deleted ${deletedHistories.count} order status history entries`);

  // 4. Delete payments
  const deletedPayments = await prisma.payment.deleteMany({});
  console.log(`- Deleted ${deletedPayments.count} dummy payments`);

  // 5. Delete invoice items & invoices
  const deletedInvoiceItems = await prisma.invoiceItem.deleteMany({});
  const deletedInvoices = await prisma.invoice.deleteMany({});
  console.log(`- Deleted ${deletedInvoices.count} dummy invoices (${deletedInvoiceItems.count} items)`);

  // 6. Delete order items & orders
  const deletedOrderItems = await prisma.orderItem.deleteMany({});
  const deletedOrders = await prisma.order.deleteMany({});
  console.log(`- Deleted ${deletedOrders.count} dummy orders (${deletedOrderItems.count} items)`);

  // 7. Delete quote items, files & quotes
  const deletedQuoteFiles = await prisma.quoteFile.deleteMany({});
  const deletedQuoteItems = await prisma.quoteItem.deleteMany({});
  const deletedQuotes = await prisma.quote.deleteMany({});
  console.log(`- Deleted ${deletedQuotes.count} dummy quotes (${deletedQuoteItems.count} items, ${deletedQuoteFiles.count} files)`);

  // 8. Delete enquiries
  const deletedEnquiries = await prisma.enquiry.deleteMany({});
  console.log(`- Deleted ${deletedEnquiries.count} dummy enquiries`);

  // 9. Delete audit logs & notifications
  const deletedAudit = await prisma.auditLog.deleteMany({});
  const deletedNotifs = await prisma.notification.deleteMany({});
  console.log(`- Deleted ${deletedAudit.count} audit logs & ${deletedNotifs.count} notifications`);

  // 10. Delete demo customers
  const deletedCustomers = await prisma.customer.deleteMany({
    where: {
      user: {
        email: { not: 'godwin6945@gmail.com' },
      },
    },
  });
  console.log(`- Deleted ${deletedCustomers.count} demo customer profiles`);

  // 11. Delete all demo users EXCEPT godwin6945@gmail.com
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      email: { not: 'godwin6945@gmail.com' },
    },
  });
  console.log(`- Deleted ${deletedUsers.count} demo user accounts`);

  // Verify remaining users
  const remainingUsers = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true },
  });
  console.log('\nRemaining verified accounts in database:');
  console.table(remainingUsers);

  // Check material rates count
  const materialCount = await prisma.materialRate.count();
  console.log(`\nActive Master Material Rates in Catalog: ${materialCount} materials`);
  console.log('✨ Database is completely clean and ready for real production orders!');
}

cleanDummyData()
  .catch((err) => {
    console.error('Error cleaning dummy data:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
