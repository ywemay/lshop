const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

// router.post("/signup", UserController.user_signup);
router.post("/login", UserController.user_login);
router.get("/info", checkAuth, UserController.info);
router.post("/logout", checkAuth, UserController.logout);
// router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
