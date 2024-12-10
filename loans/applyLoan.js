const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Applies for a loan by inserting loan details into the database.
 * @param {number} farmerID - The ID of the farmer applying for the loan.
 * @param {number} loan_amount - The loan amount requested.
 * @param {string} issuer_bank - The bank issuing the loan.
 * @param {string} reason - The reason for applying for the loan.
 * @returns {Promise<object>} - A promise that resolves to the status of the loan application.
 */
async function applyLoan(farmerID, loan_amount, issuer_bank, reason) {
  try {
    // Insert loan details into the database
    const newLoan = await prisma.loanApplication.create({
      data: {
        farmerID: farmerID,
        loanAmount: loan_amount,
        issuerBank: issuer_bank,
        reasonForLoan: reason,
        loanAskedDate: new Date(), // Assuming you want to record the date of application
      },
    });

    return {
      success: true,
      message: "Loan application successful.",
      data: newLoan,
    };
    // Add a better error handling.
  } catch (error) {
    console.error("Error applying for loan:", error);
    return {
      success: false,
      message: "Failed to apply for loan.",
      error: error.message,
    };
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = applyLoan;
