const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getSignUp = (req, res, next) => {
  res.render("auth/sign-up", {
    isLoggedIn: false,
    currentPath: "/sign-up",
    oldInput: {
      firstName: "",
      lastName: "",
      email: "",
      userType: "",
      term: "",
    },
    userType: "",
  });
};

exports.postSignUp = [
  //First Name
  check("firstName")
    .notEmpty()
    .withMessage("First name should not be empty")
    .trim()
    .isLength({ min: 3 })
    .withMessage("First name should be at least of 3 characters.")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters"),
  // Last Name
  check("lastName")
    .notEmpty()
    .withMessage("First name should not be empty")
    .trim()
    .isLength({ min: 3 })
    .withMessage("First name should be at least of 3 characters.")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters"),
  // Email
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  // Password
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 charters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least single lower case character")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least single upper case character")
    .matches(/[!@#$%^&*()_<>?,.:{}|]/)
    .withMessage("Password must contain at least single special character")
    .trim(),
  // Confirm Password
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error("Password does not match");
      }
      return true;
    }),
  // User Type
  check("userType")
    .notEmpty()
    .withMessage("Please select your user type.")
    .isIn(["guest", "host"])
    .withMessage("Invalid User Type"),
  // Terms and Conditions
  check("terms")
    .notEmpty()
    .withMessage("Please accept the Terms and Conditons")
    .custom((value) => {
      if (value !== "on") {
        throw new Error("You must accept the terms and conditions");
      }
      return true;
    }),

  async (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).render("auth/sign-up", {
        isLoggedIn: false,
        currentPath: "/sign-up",
        errorMessage: error.array().map((err) => err.msg),
        oldInput: {
          firstName,
          lastName,
          email,
          userType,
        },
        userType: "",
      });
    }

    try {
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            userType,
          });
          return user.save();
        })
        .then((result) => {
          console.log("User created:", result);
          return res.redirect("/login"); // ✅ return here too, just in case
        });
    } catch (err) {
      console.error("Error saving user:", err);

      return res.status(400).render("auth/sign-up", {
        isLoggedIn: false,
        currentPath: "/sign-up",
        errorMessage: [err.message || "Failed to create user."],
        oldInput: {
          firstName,
          lastName,
          email,
          userType,
        },
        userType: "",
      });
    }
  },
];

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    isLoggedIn: false,
    currentPath: "/login",
    errorMessage: [],
    oldInput: { email: "" },
    userType: "",
  });
};

exports.postLogin = async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).render("auth/login", {
      isLoggedIn: false,
      currentPath: "/sign-up",
      errorMessage: ["Invalid email or password"],
      oldInput: { email },
      userType: "",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).render("auth/login", {
      isLoggedIn: false,
      currentPath: "/sign-up",
      errorMessage: ["Invalid email or password"],
      oldInput: { email },
      userType: ""
    });
  }
  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  res.redirect("/");

  // res.cookie("isLoggedIn", true);
  // req.isLoggedIn = true;
};

exports.postLogout = (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.log("Error destroying session:", err);
      }
      res.redirect("/login");
    });
  } else {
    res.redirect("/login");
  }
};
