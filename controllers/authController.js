const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

// Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "student",
        });

        res.status(201).json({
            message: "User registered successfully",
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.findOne({ email });

        // 1️⃣ Check if user exists
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 2️⃣ Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 3️⃣ STRICT role check
        if (user.role !== role) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // 4️⃣ If everything correct
        res.json({
            token: generateToken(user._id),
            role: user.role
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


exports.createUserByAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!["coordinator", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    res.status(201).json(user);
};
