const {
  signupfunc,
  deletAll,
  loginuser,
  logout,
  isAuth,
  getDetails,
  deletMe,
  forgetPassword,
  resetPassword,
  addEmail,
} = require("../controllers/authController");

const router = require("express").Router();

// sign up route
router.route("/register").post(signupfunc).delete(isAuth, deletAll);
router.route("/login").post(loginuser);
router.route("/logout").get(isAuth, logout);
router.route("/me").get(isAuth, getDetails).delete(isAuth, deletMe);
router.route("/addchat").post(isAuth, addEmail);

router.route("/forget").post(forgetPassword);
router.route("/resetPassword").post(resetPassword);
module.exports = router;
