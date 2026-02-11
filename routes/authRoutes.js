const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/create-user",
    protect,
    authorize("admin"),
    createUserByAdmin
);

module.exports = router;
