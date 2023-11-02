import React, { useState } from "react";
import AuthService from "../services/auth.service";

const SecondFa = (props) => {
    const [message, setMessage] = useState(false);
    const [qrCode, setQrCode] = useState("");

    const onChangeQrcode = (e) => {
        const qrcode = e.target.value;
        setQrCode(qrcode);
    };

    const verifyQrCode = () => {
        if(qrCode.length > 0){
            setMessage("");
            let currentUser = props.currentUser;
            AuthService.validateQrCode(qrCode, currentUser.id).then(result => {
                if(result.validated){
                    window.location.replace("/profile");
                } else {
                    setMessage("Please insert valid QR code.");
                }
            })
        } else {
            setMessage("Please insert QR code.");
        }
    }

    return (
        <div className="col-md-12">
            <div className="card card-container">
                <img src={`${props.qrCode}`} />
                
                    <div>
                        <div className="form-group">
                            <label htmlFor="qrCode">Insert qrCode</label>
                            <input
                            type="text"
                            className="form-control"
                            name="qrCode"
                            value={qrCode}
                            onChange={onChangeQrcode}
                            />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary btn-block" onClick={verifyQrCode}>Submit</button>
                        </div>
                        {message && ( 
                            <div style={{ color: 'red' }}>
                                {message}
                            </div>
                        )}
                    </div>               
            </div>
        </div>
    );
}
export default SecondFa;