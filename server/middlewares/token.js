require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
  generateAccessToken: async (data) => {
    return jwt.sign(data, process.env.ACCESS_SECRET, {
      expiresIn: 60 * 60,
    });
  },
  generateRefreshToken: async (data) => {
    return jwt.sign(data, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
    }); // 유보
  },
  isAuthorized: async (req, res) => {
    const authorization =
      req.headers["Authorization"] || req.headers["authorization"];
    if (authorization) {
      const token = authorization.split(" ")[1];
      try {
        return jwt.verify(token, process.env.ACCESS_SECRET);
      } catch (err) {
        console.log(err);
      }
    }
  },
};
