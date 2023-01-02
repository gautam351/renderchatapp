const { isAuth } = require("../controllers/authController");
const {
  getuserDetails,
  sendmessage,
  getchats,
} = require("../controllers/chatController");

const router = require("express").Router();

router.route("/message").post(isAuth, sendmessage);
router.route("/getchat").post(isAuth, getchats);

module.exports = router;
