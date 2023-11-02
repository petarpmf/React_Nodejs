import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";

const BoardUser = () => {
  const [content, setContent] = useState("");

  useEffect(async () => {
    const qrCodeStatus = await AuthService.getCurrentQrCodeStatus();
    if(qrCodeStatus){
      UserService.getUserBoard().then(
        (response) => {
          setContent(response.data);
        },
        (error) => {
          const _content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
  
          setContent(_content);
  
          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout");
          }
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

export default BoardUser;
