import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ResetPass = () => {
  const [Password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
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
  const { token } = useParams();
  const submit = async () => {
    Password.trim();
    confirmPassword.trim();
    if (Password == "" || confirmPassword == "") {
      toast.error("Kindly Fill All Details", alertconfig);
      return;
    }
    if (Password != confirmPassword) {
      toast.error("Password and Confirm Password Doesn't match", alertconfig);
      return;
    }
    const info = {
      token,
      Password,
    };
    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post("/api/v1/resetPassword", info, config);
    console.log(data);
    if (!data.success) {
      toast.error(data.message, alertconfig);
      return;
    }
    toast.success(data.message, alertconfig);
  };
  return (
    <>
      <div className="fromcontainer">
        <div className="signup">
          <input
            type="text"
            disabled
            placeholder="Update Password"
            className="heading"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={Password}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setconfirmPassword(e.target.value)}
            value={confirmPassword}
          />

          <button className="signupbtn" onClick={submit}>
            Update
          </button>
        </div>
        <div className="changepagebtn">
          <button className="signupbtn" onClick={(e) => navigate("/")}>
            Home
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

export default ResetPass;
