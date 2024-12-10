require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { registerUser, loginUser } = require("./auth/authController");
const fetchLoans = require("./loans/fetchFarmerLoans");
const applyLoan = require("./loans/applyLoan");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.post("/auth/register", registerUser);
app.post("/auth/login", loginUser);
app.get("/user/loans", async (req, res) => {
  const { farmerID } = req.body;

  if (!farmerID) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: farmerID.",
    });
  }

  try {
    // Call the applyLoan function with the request body data
    const result = await fetchLoans(farmerID);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Error in /user/loans route:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});
app.post("/loans/apply", async (req, res) => {
  const { farmerID, loan_amount, issuer_bank, reason } = req.body;

  if (!farmerID || !loan_amount || !issuer_bank || !reason) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: farmerID, loan_amount, issuer_bank, or reason.",
    });
  }

  try {
    // Call the applyLoan function with the request body data
    const result = await applyLoan(farmerID, loan_amount, issuer_bank, reason);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("Error in /loans/apply route:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
