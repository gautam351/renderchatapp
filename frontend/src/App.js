import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/Profile";
import ResetPass from "./components/ResetPass";

import { ChakraProvider } from "@chakra-ui/react";
import ChatScreen from "./components/ChatScreen";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ChakraProvider>
              <Home />
            </ChakraProvider>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resetPassword/:token" element={<ResetPass />} />
        <Route path="/chat" element={<ChatScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
