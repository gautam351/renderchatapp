import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Profile = () => {
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
      console.log(data);
      if (!data.success) navigate("/");
      toast.success(`welcome ${data.data.name} !`);
    };
    autoLogin();
  }, []);

  const logout = async () => {
    const { data } = await axios.get("/api/v1/logout", {
      headers: { "Content-Type": "application/json" },
    });
    console.log(data);
    navigate("/");
  };
  return (
    <>
      <button onClick={logout}>Logout</button>

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

export default Profile;
