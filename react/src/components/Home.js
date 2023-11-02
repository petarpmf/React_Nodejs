import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

const Home = () => {
  const [content, setContent] = useState("");

  useEffect(async() => {
    const qrCodeStatus = await AuthService.getCurrentQrCodeStatus();
    if(qrCodeStatus){
      UserService.getPublicContent().then(
        (response) => {
          setContent(response.data);
        },
        (error) => {
          const _content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
  
          setContent(_content);
        }
      );
    } else {
      window.location.replace("/profile");
    }
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default Home;
