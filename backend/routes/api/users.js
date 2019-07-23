const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

// @route  POST api/users
// @desc   Register User
// @access Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with min of 6 character"
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
    }
    const { name, email, password } = req.body;

    try {
      async function init() {
        let user = await User.findOne({ email });
        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "User already exists" }] });
        }
        const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
        user = new User({
          name,
          email,
          avatar,
          password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.save();

        res.send("User registered");
      }
      init();
    } catch (error) {
      console.error(error);
      res.status(500).send("server error");
    }
  }
);
module.exports = router;
// check user exists
// get users gravitar
// encrypt password
// return jwt
