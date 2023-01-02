import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./chatscreen.css";
import { Stack } from "@mui/system";
import Avatar from "@mui/material/Avatar";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as EmailValidator from "email-validator";
import io from "socket.io-client";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import "./utilComponents/ChatBody.css";
// import { TextField } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
const EndPoint = "https://chatappbackend1.onrender.com/";
// const EndPoint = "http://localhost:8001/";

var socketi, selectedchatcompare;
export const UserContext = createContext();
const ChatScreen = () => {
  const [open, setopen] = useState(false);
  const [addemail, setemail] = useState("");
  const [user, setuser] = useState(null);
  const [chatlist, setchatList] = useState([]);
  const [chatid, setchatid] = useState(null);
  const [socket, setsocketsatate] = useState(null);
  const [msgchats, setmsgchats] = useState([]);
  const [message, setmessage] = useState(null);
  const lastmsg = useRef(0);
  const alertconfig = {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  const navigate = useNavigate();
  useEffect(() => {
    const autoLogin = async () => {
      const { data } = await axios.get("/api/v1/me", {
        headers: { "Content-Type": "application/json" },
      });
      //console.log(data);

      if (!data.success) navigate("/");
      toast.success(`welcome ${data.data.name} !`, alertconfig);
      setuser(data?.data);
      setchatList(data?.data.users);

      //socket connection
      socketi = io(EndPoint);
      socketi?.emit("setup", data.data.email);
      setsocketsatate(socketi);
      socketi?.on("connected", () => {
        setsocketconnected(true);

        //console.log("connected to socket");
      });

     



    };
    autoLogin();
  }, []);



  const logout = async () => {
    await axios.get("/api/v1/logout", {
      headers: { "Content-Type": "application/json" },
    });
    //console.log(data);
    navigate("/");
  };

  const [socketconnected, setsocketconnected] = useState(false);

  const addEmail = async (e) => {
    if (EmailValidator.validate(addemail)) {
      const { data } = await axios.post(
        "/api/v1/addchat",
        { email: addemail },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      //console.log(data);
      if (!data.success) toast.error(data.message, alertconfig);
      else {
        toast.success(data.message, alertconfig);
        //console.log(data.data.users);
        setchatList(data.data.users);
      }
      setopen(false);
      setemail("");
    } else toast.error("invalid email to add", alertconfig);
    //console.log(chatlist);
  };

  const sendmessage = async (e) => {
    e.preventDefault();
    const info = {
      to: chatid,
      from: user.email,
      message: message,
    };

   
    const { data } = await axios.post("/api/v1/message", info, {
      headers: { "Content-Type": "application/json" },
    });
    //console.log(data);
    if (data.success) {
      setmsgchats([...msgchats, info]);
      // await getChats();
      
      socket?.emit("send message", info);
     
      
    } else console.log(data.message);
    
    setmessage("");
   

  };

  const getChats = async () => {
    // socketapi.emit("changing chat");

    //console.log("connectedUser runned" + chatid);
    // //console.log(socket);

    const { data } = await axios.post(
      "/api/v1/getchat",
      { to: chatid },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (data.success) {
      // console.log(data.data);
      setmsgchats(data.data);
    } else {
      console.log(data.message);
      console.log(chatid);
      //  setmsgchats([]);
    }
    // props?.socketsatate?.emit("join chat", props?.email);
  };

  useEffect(() => {
    const fuc=async()=>{
     await  getChats();
     selectedchatcompare = chatid;
    }  
  
   fuc();

  
  }, [chatid]);

  const scrolltobottom = async () => {
    const tabs = lastmsg.current;
    if (tabs && chatid) {
      tabs.scrollIntoView();
    }
  };

  useEffect(() => {
    socketi?.on("new message", async (data) => {
      if (data.from == selectedchatcompare && data.to == user.email) {
        setmsgchats([...msgchats, data]);
        // msgchats.push(data);
        await getChats();
       
      }
  

    },[]);
      scrolltobottom();
    
  });

  const chatclicked = async (email) => {
    // e.preventDefault();
    //console.log("clicked");
    //console.log(email);
    setchatid(email);
    // await getChats();
    console.log(chatid);
    socketi?.emit("join chat", email);
  };
  return (
    <>
      <div className="container">
        <div className="header">
          <div className="headleft">
            <Avatar
              className="avatar"
              src="https://lh3.googleusercontent.com/a-/AOh14GjnQC-DpBbVewq6ax2f4uVIs2SZgE3HlJvfw4ompQ=s96-c"
            ></Avatar>
            <MoreVertRoundedIcon className="icon " />
            <ExitToAppRoundedIcon className="icon" onClick={logout} />
          </div>
          <div className="headright">
            <div className="headrightleft">
              <Avatar
                className="avatar"
                src="https://lh3.googleusercontent.com/a-/AOh14GjnQC-DpBbVewq6ax2f4uVIs2SZgE3HlJvfw4ompQ=s96-c"
              ></Avatar>

              <p className="leftname">{chatid}</p>
            </div>
            <div className="headrightright">
              <FileDownloadIcon className="icon" />
              <MoreVertRoundedIcon className="icon visible" />

              <AttachMoneyIcon className="icon " />
            </div>
          </div>
        </div>
        <div className="body">
          <div className="left">
            <div className="addchat" title="Add Chat">
              <Button onClick={(e) => setopen(true)}>
                <AddCircleOutlineRoundedIcon className="addbtn" />
              </Button>
              <Dialog open={open} onClose={(e) => setopen(false)}>
                <DialogTitle>Add Chat</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    To add a chat enter its username
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={addemail}
                    onChange={(e) => setemail(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={(e) => setopen(false)}>Cancel</Button>
                  <Button onClick={(e) => addEmail(e)}>ADD</Button>
                </DialogActions>
              </Dialog>
            </div>
            <div className="chatList">
              {chatlist.map((element) => {
                return (
                  // <label onClick={(e) => chatclicked(element.email)}>
                  // <UserContext.Provider value={socket}>
                  //   <ChatName
                  //     name={element.name}
                  //     email={element.email}
                  //     setchatid={setchatid}
                  //   />
                  // </UserContext.Provider>
                  // </label>

                  <>
                    <div
                      className="chatname"
                      onClick={(e) => chatclicked(element.email)}
                    >
                      <Avatar 
                        className="avatar"
                        src="https://lh3.googleusercontent.com/a-/AOh14GjnQC-DpBbVewq6ax2f4uVIs2SZgE3HlJvfw4ompQ=s96-c"
                      ></Avatar>

                      <p className="leftname">{element.name}</p>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
          <div className="right">
            {chatid ? (
              <div className="ChatBody">
                <div className="messages">
                  {msgchats?.map((e) => {
                    return (
                      <div
                        className={`msg ${
                          e.from == chatid ? "msgleft" : "msgright"
                        }`}
                      >
                        <p className="msgchip">{e.message}</p>
                      </div>
                    );
                  })}
                  <div ref={lastmsg}></div>
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
            ) : (
              console.log("null it is")
            )}
          </div>
        </div>

        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  );
};

export default ChatScreen;
