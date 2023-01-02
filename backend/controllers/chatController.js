const ChatModel = require("../models/ChatModel");

exports.sendmessage = async (req, res, next) => {
  const { to, message } = req.body;
  const from = req.useremail;

  if (!from || !to || !message) {
    return res.status(200).json({
      success: false,
      message: "insufficient info",
    });
  }

  let data = await ChatModel.findOne({ msgfrom: from, msgto: to });
  let data1 = await ChatModel.findOne({ msgfrom: to, msgto: from });

  if (!data) {
    data = await ChatModel.create({ msgfrom: from, msgto: to });
  }
  if (!data1) {
    data1 = await ChatModel.create({ msgfrom: to, msgto: from });
  }

  await data.messages.push({ message: message, from: from });
  await data1.messages.push({ message: message, from: from });

  await data.save({ validateBeforeSave: false });
  await data1.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    data,
    data1,
  });
};

exports.getchats = async (req, res, next) => {
  const { to } = req.body;
  const from = req.useremail;
  const data = await ChatModel.findOne({ msgfrom: from, msgto: to });
  if (!data) {
    return res.status(200).json({
      success: false,
      message: "not found",
    });
  }
  return res.status(200).json({
    success: true,
    data: data.messages,
  });
};
