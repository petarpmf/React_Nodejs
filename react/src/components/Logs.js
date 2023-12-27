import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";

const Logs = () => {
  const [content, setContent] = useState([]);
  const mystyleTable = {
    padding: "10px 25px 10px 25px;",
    padding: "15px",
  };

  const mystyleText = {
    padding: "10px 25px 10px 25px;",
    width: "auto",
    fontWeight: "bold"
  };

  useEffect(async () => {
    const qrCodeStatus = await AuthService.getCurrentQrCodeStatus();

    if(qrCodeStatus){
      UserService.getLogs().then(
        (response) => {
          setContent(response.data);
          
          console.log("0120-10-")
          console.log(response.data)
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
    }else{
      window.location.replace("/profile");
    }
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
      <div style={mystyleText}>Recently registered users</div>
      <table>
        <thead>
          <tr>
            <th style={mystyleTable}>ID</th>
            <th style={mystyleTable}>Priority</th>
            <th style={mystyleTable}>Username</th>
            <th style={mystyleTable}>Email</th>
            <th style={mystyleTable}>Created At</th>
          </tr>
        </thead>
        <tbody>
        {content.map((content, index) => (
              <tr key={index}>
                <td style={mystyleTable}>{content.id}</td>
                <td style={mystyleTable}>{content.priority}</td>
                <td style={mystyleTable}>{content.username}</td>
                <td style={mystyleTable}>{content.email}</td>
                <td style={mystyleTable}>{content.createdAt}</td>
              </tr>
            ))}
        </tbody>
      </table>
      </header>
    </div>
  );
};

export default Logs;
