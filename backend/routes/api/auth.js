const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
// @route GET api/auth
// @desc Test Route
//@access Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    error.status(500).send("Server Error");
  }
});
// @route  POST api/auth
// @desc   Authotizing user and get token
// @access Public
router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "password is required").exists()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
    }
    const { email, password } = req.body;

    try {
      async function init() {
        let user = await User.findOne({ email });
        if (!user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid credentials" }] });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid credentials" }] });
        }

        const payLoad = {
          user: {
            id: user.id
          }
        };
        jwt.sign(
          payLoad,
          config.get("jwtSecret"),
          {
            expiresIn: 1000
          },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      }
      init();
    } catch (error) {
      console.error(error);
      res.status(500).send("server error");
    }
  }
);
module.exports = router;
