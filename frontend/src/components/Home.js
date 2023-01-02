import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Home = () => {
  const [type, settype] = useState("register");
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [alert, setalert] = useState(false);
  const [alertText, setalertText] = useState("alert");
  const alertconfig = {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  let navigate = useNavigate();

  // useEffect

  useEffect(() => {
    const autoLogin = async () => {
      const { data } = await axios.get("api/v1/me", {
        headers: { "Content-Type": "application/json" },
      });
      if (data.success) navigate("/chat");
    };
    autoLogin();
  }, []);

  // submit function
  const submit = async () => {
    email.trim();
    name.trim();
    password.trim();
    const info = {
      userName: name,
      email: email,
      Password: password,
    };
    const config = { headers: { "Content-Type": "application/json" } };
    if (type == "register") {
      if (email == "" || name == "" || password == "") {
        toast.warning("Kindly fill All Fields", alertconfig);

        return;
      }

      const { data } = await axios.post("api/v1/register", info, config);
      console.log(data);
      if (data?.success) navigate("/chat");
      else toast.error(data.message, alertconfig);
    } else if (type == "login") {
      if (email == "" || password == "") {
        toast.warning("Kindly fill All Fields", alertconfig);
        return;
      }
      const { data } = await axios.post("api/v1/login", info, config);
      console.log(data);
      if (data?.success) navigate("/chat");
      else toast.error(data.message, alertconfig);
    } else if (type == "Reset") {
      if (email == "") {
        toast.warning("Kindly fill All Fields", alertconfig);
        return;
      }

      const { data } = await axios.post("api/v1/forget", info, config);
      console.log(data);
      if (data?.success) toast.success(`Email sent to ${email}`, alertconfig);
      else toast.error(data?.message, alertconfig);
    }
  };
  return (
    <>
      <div className="fromcontainer">
        <div className="signup">
          <input type="text" disabled placeholder={type} className="heading" />
          {type == "register" ? (
            <input
              type="text"
              placeholder="UserName"
              onChange={(e) => setname(e.target.value)}
              value={name}
            />
          ) : null}

          <input
            type="email"
            placeholder="UserEmail"
            onChange={(e) => setemail(e.target.value)}
            value={email}
          />

          {type == "register" || type == "login" ? (
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setpassword(e.target.value)}
              value={password}
            />
          ) : null}
          {type == "login" ? (
            <a className="forget" onClick={(e) => settype("Reset")}>
              forget Password?
            </a>
          ) : null}
          <button className="signupbtn" onClick={submit}>
            {type == "register"
              ? "Sign Up"
              : type == "login"
              ? "Login"
              : "Send Email"}
          </button>
        </div>
        <div className="changepagebtn">
          <button
            className="signupbtn"
            onClick={(e) =>
              type == "register" ? settype("login") : settype("register")
            }
          >
            {type == "register" ? "Login" : "register"}
          </button>
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
    </>
  );
};

export default Home;
