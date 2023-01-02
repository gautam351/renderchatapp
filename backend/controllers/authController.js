const userSchema = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const ChatModel = require("../models/ChatModel");
exports.signupfunc = async (req, res, next) => {
  const { userName, email, Password, picUrl } = req.body;

  if (!userName || !email || !Password) {
    return res.status(200).json({
      success: false,
      message: "insufficient info",
    });
  }
  const checkemail = await userSchema.find({
    email: email,
  });
  if (checkemail.length > 0) {
    return res.status(200).json({
      success: false,
      message: "email already exist",
    });
  }

  const User = await userSchema.create({
    name: userName,
    email: email,
    password: Password,
    pic:
      picUrl ||
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  });

  const token = jwt.sign({ id: User._id }, process.env.JWTSECRET, {
    expiresIn: "1h",
  });

  return res
    .status(201)
    .cookie()
    .cookie("token", token, {
      expires: new Date(Date.now() + 900000),
      secure: false,

      httpOnly: true,
    })
    .json({
      success: true,
      User,
      token,
    });
};

exports.loginuser = async (req, res, next) => {
  const { email, Password } = req.body;
  const check = await userSchema.findOne({ email: email }).select("+password");
  if (!check) {
    return res.status(200).json({
      success: false,
      message: "username doesn't exist",
    });
  }
  console.log(check);
  const compare = await bcrypt.compare(Password, check.password);
  if (!compare) {
    return res.status(200).json({
      success: false,
      message: "invalid credentials",
    });
  }

  const token = jwt.sign({ id: check._id }, process.env.JWTSECRET, {
    expiresIn: "1h",
  });

  return res
    .status(200)
    .cookie("token", token, {
      expires: new Date(Date.now() + 900000),
      secure: false,

      httpOnly: true,
    })
    .json({
      success: true,
      check,
    });
};

exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  return res.status(200).json({
    success: true,
    message: "user logged out",
  });
};

exports.deletAll = async (req, res, next) => {
  await userSchema.deleteMany({});
  return res.status(200).json({
    success: true,
  });
};

exports.isAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(200).json({
      message: "unauthorized",
    });
  }
  const decodedtoken = jwt.verify(token, process.env.JWTSECRET);
  const data = await userSchema.findById(decodedtoken.id);
  if (!data) {
    return res.status(200).json({
      message: "unauthorized",
    });
  }
  req.user = data._id;
  req.useremail = data.email;
  next();
};

exports.getDetails = async (req, res, next) => {
  const id = req.user;
  const data = await userSchema.findById(id);
  return res.status(200).json({
    success: true,
    data,
  });
};

exports.deletMe = async (req, res, next) => {
  const id = req.user;
  await userSchema.findByIdAndDelete(id);
  return res.status(200).json({
    success: true,
  });
};

exports.forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await userSchema.findOne({ email: email });
  if (!user) {
    return res.status(200).json({
      success: false,
      message: "Email not found",
    });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //15min
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/resetPassword/${resetToken}`;
  console.log(resetURL);

  const message = `your reset password url is ${resetURL}`;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email, // Change to your recipient
    from: "gautampraveen351@gmail.com", // Change to your verified sender
    subject: "Reset Password",
    text: `click on the link to reset Password ${resetURL}`,
  };

  await sgMail
    .send(msg)
    .then(() => {
      console.log("mail sent");
    })
    .catch((e) => {
      console.log(e);
      return res.status(200).json({
        success: true,
        message: "Error Ocuured Try Again",
        error: e,
      });
    });

  return res.status(200).json({
    success: true,
    message: "Email sent ",
    user,
  });
};

exports.resetPassword = async (req, res, next) => {
  const { token, Password } = req.body;
  if (!token || !Password) {
    return res.status(200).json({
      success: false,
      message: "Insufficient Details",
    });
  }

  const resettoken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await userSchema.findOne({ resetPasswordToken: resettoken });
  const today = new Date(Date.now());
  console.log(user);
  if (!user) {
    return res.status(200).json({
      success: false,
      message: "Link Expired",
    });
  }
  if (user.resetPasswordExpire < today) {
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      success: false,
      message: "Link Expired",
    });
  }

  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  user.password = Password;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json({
    success: true,
    message: "Password successsfully Upadted",
  });
};

exports.addEmail = async (req, res, next) => {
  const { email } = req.body; //addchat email
  const useremail = req.useremail;
  if (!email) {
    return res.status(200).json({
      success: false,
      message: "insufficient info",
    });
  }

  if (email == useremail) {
    return res.status(200).json({
      success: false,
      message: "cannot add Yourself",
    });
  }

  const check = await userSchema.findOne({ email: email });
  if (!check) {
    return res.status(200).json({
      success: false,
      message: "email is not registered ",
    });
  }
  const data = await userSchema.findOne({ email: useremail });

  let t = 0;

  const isexist = data.users.some((e) => e.email == email);

  if (isexist) {
    return res.status(200).json({
      success: false,
      message: "email is already added",
    });
  }
  await data.users.push({ name: check.name, email: email });
  console.log(check.name);
  await data.save({ validateBeforeSave: false });

  await ChatModel.create({ msgfrom: email, msgto: useremail });
  await ChatModel.create({ msgfrom: useremail, msgto: email });

  res.status(200).json({
    success: true,
    message: "chat added successfully",
    data,
  });
};
