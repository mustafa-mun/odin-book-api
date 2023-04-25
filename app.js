const session = require("express-session");
const passport = require("passport");
const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const compression = require("compression");
const helmet = require("helmet");
// const seed = require("./seed");
require("dotenv").config();

// Initialize swagger-jsdoc
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "ODIN-BOOK API",
      version: "1.0.0",
      description:
        "Here is the API documentation for My Odin-book API. Please note that authentication is required and you must obtain a token by logging in before making requests to protected routes.",
      contact: {
        name: "me",
        email: "beginnerdev7@gmail.com",
      },
    },
    servers: [
      {
        url: "https://odinbook-ib41.onrender.com",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const timelineRouter = require("./routes/timeline");

const app = express();
// Set up rate limiter: maximum of twenty requests per minute
var RateLimit = require("express-rate-limit");
var limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI || process.env.LOCAL_URI;

async function mongooseConnect() {
  await mongoose.connect(mongoDB);
}
mongooseConnect().catch((err) => console.log(err));

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/timeline", timelineRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status).json({ err });
});

module.exports = app;
