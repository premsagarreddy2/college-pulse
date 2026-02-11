const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));

const { protect, authorize } = require("./middleware/authMiddleware");

app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "You accessed protected route",
        user: req.user,
    });
});



app.get(
    "/api/admin-only",
    protect,
    authorize("admin"),
    (req, res) => {
        res.json({
            message: "Welcome Admin 🎯",
            user: req.user,
        });
    }
);


// Test Route
app.get("/", (req, res) => {
    res.send("Campus Pulse API Running 🚀");
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
