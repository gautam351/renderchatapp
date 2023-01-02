import { Avatar } from "@mui/material";
import React, { useContext } from "react";
import { UserContext } from "../ChatScreen";

const ChatName = ({ name, email, setchatid }) => {
  const socketapi = useContext(UserContext);
  const chatclicked = async (e) => {
    e.preventDefault();
    console.log("clicked");
    setchatid(email);
    socketapi.emit("join chat", email);
  };
  return (
    <>
      <div className="chatname" onClick={(e) => chatclicked(e)}>
        <Avatar
          className="avatar"
          src="https://lh3.googleusercontent.com/a-/AOh14GjnQC-DpBbVewq6ax2f4uVIs2SZgE3HlJvfw4ompQ=s96-c"
        ></Avatar>

        <p className="leftname">{email}</p>
      </div>
    </>
  );
};

export default ChatName;
