import React, { useState, useEffect, useContext } from "react";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import "./ChatBody.css";
import { TextField } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "axios";
import { UserContext } from "../ChatScreen";
// socket variables

const ChatBody = ({ email, user }) => {
  const [chats, setchats] = useState([]);
  const [message, setmessage] = useState(null);
  const socketapi = useContext(UserContext);
  // console.log(socketapi);
  // socket useeffect connection

  useEffect(() => {
    const getChats = async () => {
      // socketapi.emit("changing chat");

      console.log("connectedUser runned" + email);
      // console.log(socket);

      const { data } = await axios.post(
        "/api/v1/getchat",
        { to: email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (data.success) {
        console.log(data.data);
        setchats(data.data);
      } else {
        console.log(data.message);
        setchats([]);
      }
      // props?.socketsatate?.emit("join chat", props?.email);
    };
    getChats();
  }, [email]);
  useEffect(() => {
    console.log(email);
    console.log(user);
    socketapi.on("new message", (data) => {
      if (data.to != user && data.from != email) return;
      else if (data.to == user && data.from == email) {
        console.log(chats);
        setchats([...chats, data]);
        // return setchats((chats) => [...chats, data]);
        // chats.push(data);
        // setchats(chats);
        // // console.log();
      }
    });
  });
  const sendmessage = async (e) => {
    e.preventDefault();
    const info = {
      to: email,
      from: user,
      message: message,
    };
    const { data } = await axios.post("/api/v1/message", info, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(data);
    if (data.success) {
      setchats([...chats, info]);

      socketapi.emit("send message", info);
    } else console.log(data.message);

    setmessage("");
  };

  return (
    <div className="ChatBody">
      <div className="messages">
        {chats?.map((e) => {
          return (
            <div className={`msg ${e.from == email ? "msgleft" : "msgright"}`}>
              {console.log(chats)}
              <p className="msgchip">{e.message}</p>
            </div>
          );
        })}
      </div>

      {/* footer */}

      <div className="footer">
        <div className="footerLeft">
          <EmojiEmotionsOutlinedIcon className="icon " />
          <AttachFileIcon className="icon visible" />
        </div>

        <form onSubmit={(e) => sendmessage(e)} className="textField">
          <TextField
            fullWidth
            label="Message"
            id="fullWidth"
            onChange={(e) => setmessage(e.target.value)}
            value={message}
          />
        </form>

        <div className="speaktotext">
          <MicNoneOutlinedIcon className="icon mic" />
        </div>
      </div>
    </div>
  );
};

export default ChatBody;
