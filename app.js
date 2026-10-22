if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo").MongoStore || require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const expressError = require("./utils/expressError.js");
const listingsRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const signUpRoute = require("./routes/user.js");

function formatMongoUri(rawUri) {
  if (!rawUri || typeof rawUri !== "string") return rawUri;
  let uri = rawUri.trim().replace(/^["']|["']$/g, "");
  const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)([^/]+)(.*)$/i);
  if (!match) return uri;
  const [, scheme, userHost, rest] = match;
  const lastAt = userHost.lastIndexOf("@");
  if (lastAt === -1) return uri;
  const auth = userHost.slice(0, lastAt);
  const host = userHost.slice(lastAt + 1);
  const colonIdx = auth.indexOf(":");
  if (colonIdx === -1) return uri;
  let user = auth.slice(0, colonIdx);
  let pass = auth.slice(colonIdx + 1);
  if (user.startsWith("<") && user.endsWith(">")) user = user.slice(1, -1);
  if (pass.startsWith("<") && pass.endsWith(">")) pass = pass.slice(1, -1);
  const safeDecode = (s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };
  const safeUser = encodeURIComponent(safeDecode(user));
  const safePass = encodeURIComponent(safeDecode(pass));
  return `${scheme}${safeUser}:${safePass}@${host}${rest}`;
}

const rawDbUrl = process.env.ATLASDB_URL || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wanderList";
const dbUrl = formatMongoUri(rawDbUrl);

const main = async () => {
  await mongoose.connect(dbUrl);
};
main()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "mysecretcode",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionArgument = {
  store,
  secret: process.env.SECRET || "mysecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionArgument));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingsRoute);
app.use("/listings/:id/review", reviewRoute);
app.use("/", signUpRoute);

app.all("/{*splat}", (req, res, next) => {
  next(new expressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
