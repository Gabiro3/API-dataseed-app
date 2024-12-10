const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Replace with a secure secret

// Register User
async function registerUser(req, res) {
  const { username, farmerID, phone, password } = req.body;

  if (!username || !farmerID || !phone || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    const newUser = await prisma.user.create({
      data: {
        username,
        farmerID,
        phone,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "User registration failed.", details: error.message });
  }
}

// Login User
async function loginUser(req, res) {
  const { farmerID, password } = req.body;

  if (!farmerID || !password) {
    return res.status(400).json({ message: "Both Farmer ID and Password are required." });
  }

  try {
    // Find user by farmerID
    const user = await prisma.user.findUnique({
      where: { farmerID },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, farmerID: user.farmerID }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed.", details: error.message });
  }
}

module.exports = { registerUser, loginUser };
