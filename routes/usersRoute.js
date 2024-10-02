const express = require("express");
const router = express.Router();

const { registerUser } = require('../controllers/usersController.js');

router.route("/register").post(registerUser);


module.exports = router;