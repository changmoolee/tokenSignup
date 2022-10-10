import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main/Main";
import SignUp from "./pages/SignUp/SignUp";
import Userlist from "./pages/Userlist/Userlist";
import Myprofile from "./pages/Myprofile/Myprofile";
import EditPassword from "./pages/EditPassword/EditPassword";

const App = () => {
  const [isLogIn, setIsLogIn] = useState(false);

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<Main isLogIn={isLogIn} setIsLogIn={setIsLogIn} />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/userlist" element={<Userlist />} />
          <Route
            path="/myprofile"
            element={<Myprofile isLogIn={isLogIn} setIsLogIn={setIsLogIn} />}
          />
          <Route
            path="/editPassword"
            element={<EditPassword isLogIn={isLogIn} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
