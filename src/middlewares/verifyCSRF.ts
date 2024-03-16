/** @format */

const csrf = require("csurf");
// Setup csurf middleware
export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
  },
});
