const express = require("express");
const { registerUser, loginUser, createUserByAdmin } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/create-user",
    protect,
    authorize("admin"),
    createUserByAdmin
);

module.exports = router;
