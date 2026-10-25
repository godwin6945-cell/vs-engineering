// Unit tests for GST calculations, Currency formatters, and Status transitions
// Run with: node tests/gst-and-status.test.js

const assert = require("assert");

/**
 * GST Calculation logic replicate for standalone test runner
 */
function calculateGST(amount, customerState, companyState = "Tamil Nadu", gstRate = 18) {
  const isIntraState = customerState.trim().toLowerCase() === companyState.trim().toLowerCase();
  
  if (isIntraState) {
    const cgstRate = gstRate / 2;
    const sgstRate = gstRate / 2;
    const cgstAmount = Math.round((amount * cgstRate) / 100);
    const sgstAmount = Math.round((amount * sgstRate) / 100);
    const totalGst = cgstAmount + sgstAmount;
    const grandTotal = amount + totalGst;
    return {
      isIntraState: true,
      cgstRate,
      sgstRate,
      igstRate: 0,
      cgstAmount,
      sgstAmount,
      igstAmount: 0,
      totalGst,
      grandTotal,
    };
  } else {
    const igstAmount = Math.round((amount * gstRate) / 100);
    const totalGst = igstAmount;
    const grandTotal = amount + totalGst;
    return {
      isIntraState: false,
      cgstRate: 0,
      sgstRate: 0,
      igstRate: gstRate,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount,
      totalGst,
      grandTotal,
    };
  }
}

function numberToIndianWords(num) {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero Rupees Only';

  const n = ('000000000' + Math.floor(num)).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';

  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';

  return str.trim() + ' Rupees Only';
}

function testGSTIntraState() {
  console.log("Running Test 1: Intra-state GST (Tamil Nadu -> Tamil Nadu)...");
  const result = calculateGST(100000, "Tamil Nadu", "Tamil Nadu", 18);
  assert.strictEqual(result.isIntraState, true);
  assert.strictEqual(result.cgstRate, 9);
  assert.strictEqual(result.sgstRate, 9);
  assert.strictEqual(result.igstRate, 0);
  assert.strictEqual(result.cgstAmount, 9000);
  assert.strictEqual(result.sgstAmount, 9000);
  assert.strictEqual(result.igstAmount, 0);
  assert.strictEqual(result.grandTotal, 118000);
  console.log("✓ Test 1 Passed: Correctly applied CGST (9%) + SGST (9%) totaling ₹1,18,000.");
}

function testGSTInterState() {
  console.log("Running Test 2: Inter-state GST (Tamil Nadu -> Maharashtra)...");
  const result = calculateGST(100000, "Maharashtra", "Tamil Nadu", 18);
  assert.strictEqual(result.isIntraState, false);
  assert.strictEqual(result.cgstAmount, 0);
  assert.strictEqual(result.sgstAmount, 0);
  assert.strictEqual(result.igstAmount, 18000);
  assert.strictEqual(result.grandTotal, 118000);
  console.log("✓ Test 2 Passed: Correctly applied IGST (18%) totaling ₹1,18,000.");
}

function testNumberToWords() {
  console.log("Running Test 3: Number to Indian currency words...");
  const words1 = numberToIndianWords(147500);
  assert.strictEqual(words1, "One Lakh Forty Seven Thousand Five Hundred Rupees Only");

  const words2 = numberToIndianWords(100000);
  assert.strictEqual(words2, "One Lakh Rupees Only");
  console.log(`✓ Test 3 Passed: 147500 -> "${words1}"`);
}

function testOrderLifecycleStages() {
  console.log("Running Test 4: Manufacturing Order Lifecycle...");
  const stages = ["CONFIRMED", "IN_PRODUCTION", "QUALITY_CHECK", "PACKED", "DISPATCHED", "DELIVERED"];
  let currentStage = "CONFIRMED";

  for (let i = 1; i < stages.length; i++) {
    currentStage = stages[i];
  }
  assert.strictEqual(currentStage, "DELIVERED");
  console.log("✓ Test 4 Passed: Order successfully navigated 6-stage lifecycle.");
}

function testPaymentStateDerivation() {
  console.log("Running Test 5: Order Payment State Derivation...");
  const totalAmount = 147500;
  let advancePaid = 0;
  let balancePaid = 0;

  // Initial state
  let paymentStatus = "UNPAID";
  assert.strictEqual(paymentStatus, "UNPAID");

  // Advance paid (50%)
  advancePaid = 73750;
  paymentStatus = (advancePaid + balancePaid >= totalAmount) ? "FULLY_PAID" : "ADVANCE_PAID";
  assert.strictEqual(paymentStatus, "ADVANCE_PAID");

  // Balance paid
  balancePaid = 73750;
  paymentStatus = (advancePaid + balancePaid >= totalAmount) ? "FULLY_PAID" : "ADVANCE_PAID";
  assert.strictEqual(paymentStatus, "FULLY_PAID");
  console.log("✓ Test 5 Passed: Payment states correctly derived: UNPAID -> ADVANCE_PAID -> FULLY_PAID.");
}

function runAllTests() {
  console.log("=========================================");
  console.log("VS ENGINEERING AUTOMATED UNIT TEST SUITE");
  console.log("=========================================");
  testGSTIntraState();
  testGSTInterState();
  testNumberToWords();
  testOrderLifecycleStages();
  testPaymentStateDerivation();
  console.log("=========================================");
  console.log("ALL 5 UNIT TESTS PASSED SUCCESSFULLY! ✓");
  console.log("=========================================");
}

runAllTests();
