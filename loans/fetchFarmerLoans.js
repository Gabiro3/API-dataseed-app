const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetches all loans for a specific user from the database.
 * @param {number} userId - The ID of the user whose loans are to be fetched.
 * @returns {Promise<object>} - A promise that resolves to the user's loans in JSON format.
 */
async function fetchLoans(userId) {
  try {
    // Fetch loans associated with the provided user ID
    const loans = await prisma.loan.findMany({
      where: {
        farmerID: userId,
      },
      select: {
        id: true,
        loanAmount: true,
        issuerBank: true,
        interestRate: true,
        paymentsMade: true,
        loanDuration: true,
        loanReferenceID: true,
        loanAskedDate: true,
        loanIssuedDate: true,
        isLoanIssued: true,
      },
    });

    return {
      success: true,
      data: loans,
    };
  } catch (error) {
    console.error("Error fetching loans:", error);
    return {
      success: false,
      message: "Failed to fetch loans.",
      error: error.message,
    };
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = fetchLoans;
