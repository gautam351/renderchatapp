const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    msgfrom: {
      type: String,
      trim: true,
      require: true,
    },
    msgto: {
      type: String,
      trim: true,
      require: true,
    },

    messages: [
      {
        message: {
          type: String,
          trim: true,
        },
        from: {
          type: String,
          trim: true,
        },
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Chats", chatSchema);
