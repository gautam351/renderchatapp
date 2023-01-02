const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    users: [
      {
        name: {
          type: String,
          trim: true,
        },
        email: {
          type: String,
          trim: true,
        },
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// hashing the password before saving to db
// using  .pre("save"..) method  create a functionality  ued to hash the password entered by the used and store it in db in hashed form . use bcrypt for this
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

// userSchema.methods.jsonwebToken=async()
userSchema.methods.createJsonToken = async (user) => {
  const token = await jwt.sign({ id: user._id }, process.env.JWTSECRET, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = mongoose.model("User", userSchema);
