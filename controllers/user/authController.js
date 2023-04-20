const User = require("../../models/user");
const UserProfile = require("../../models/profile");
const Token_Blacklist = require("../../models/blacklisted_token");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const LocalStrategy = require("passport-local");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
require("dotenv").config();
const { body, validationResult } = require("express-validator");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        // passwords match! log user in
        return done(null, user);
      } else {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_TOKEN_KEY,
    },
    async function (jwtPayload, cb) {
      try {
        const user = await User.findOneById(jwtPayload.id);
        if (!user) {
          return cb(null, false, { message: "Incorrect username" });
        }
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);

// Auth jwt token.
exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // Search for token on header
  const token = authHeader && authHeader.split(" ")[1];
  // Search for blacklisted tokens
  const list_token = await Token_Blacklist.findOne({
    blacklisted_token: token,
  });
  // Unauthorized
  if (token == null || list_token)
    // Token is not found or blacklisted
    return res.status(401).json({
      error: "Invalid request.",
      message: "You are unauthorized.",
      path: "Take your token with POST request to /auth/login",
    });

  jwt.verify(token, process.env.JWT_SECRET_TOKEN_KEY, (err, user) => {
    if (err)
      // Forbidden
      return res.status(403).json({
        error: "Invalid request.",
        message: "Forbidden.",
        path: "Take your token with POST request to /auth/login",
      });
    req.jwt_token = user;
    next(); // Pass the control to the next middleware
  });
};

// Middleware for checking if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    const user = req.jwt_token.user;

    if (!user) {
      // User is not found
      return res.status(404).json({ error: "User not found!" });
    }

    if (user.isAdmin) {
      // User is an admin, allow access
      next();
    } else {
      // User is not an admin, deny access
      return res.status(403).json({ error: "Forbidden" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
};

/* POST signup. */
exports.post_signup = [
  body("first_name", "firstname can't be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "lastname can't be empty!")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "username must be minimum 5 characters!")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("password", "password must be minimum 8 characters!")
    .trim()
    .isLength({ min: 8 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // Inputs are valid, create user
    try {
      // Create a hashed password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const hashedUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPassword,
      });
      // Save user to database
      const userResult = await hashedUser.save();
      // Create user profile
      const profile = new UserProfile({
        user: userResult._id,
      });
      const profileResult = await profile.save();
      userResult.profile = profileResult._id;
      await userResult.save();
      // Send newly created user
      res.status(201).json({
        user: userResult,
        profile: profileResult,
      });
    } catch (error) {
      // Handle duplicate usernames
      if (error.code === 11000 && error.keyValue.username) {
        res.status(400).json({
          error: "Username already exists!",
        });
      } else {
        return res.status(400).json({ error: error.message });
      }
    }
  },
];

exports.post_login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // User not found
      return res.status(404).json({
        message: "User not found",
      });
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        return next(err);
      }
      // Include isAdmin property in the user object
      const payload = {
        user: {
          id: user._id,
          isAdmin: user.is_admin,
        },
      };
      // Sign a jwt token with the payload
      const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN_KEY, {
        expiresIn: "1h",
      });
      // Return the user and token
      return res.status(200).json({ user, token });
    });
  })(req, res, next);
};

exports.post_logout = async (req, res) => {
  // Get token
  const token = req.headers.authorization.split(" ")[1];
  try {
    // Add token on blacklist
    const blacklisted_token = new Token_Blacklist({
      token,
    });
    // Save blacklisted token on database
    const result = await blacklisted_token.save();
    res.status(200).json({
      result,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
