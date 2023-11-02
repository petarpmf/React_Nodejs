import React from "react";
import AuthService from "../services/auth.service";
import SecondFa from "./secondFa";

const Profile = () => {
  let qrCode ="";
  const currentUser = AuthService.getCurrentUser();
  const qrCodeStatus = AuthService.getCurrentQrCodeStatus();

  if(currentUser){
    qrCode = JSON.parse(currentUser.secret).data_url;
  }
  return (
    <div>  
    {qrCodeStatus && ( 
      <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}
        {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {currentUser.id}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
    </div>
    )}
      {!qrCodeStatus && (
        <div className="form-group">
            <div>
                <SecondFa qrCode={qrCode} currentUser={currentUser}/>
            </div>
        </div>
      )}
    </div>
  );
};

export default Profile;