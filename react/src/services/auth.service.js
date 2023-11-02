import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/auth/";

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("validQrCode");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getCurrentQrCodeStatus = () => {
  return JSON.parse(localStorage.getItem("validQrCode"));
};

const validateQrCode = (qrCode, userId) => {
  return axios.post(API_URL + "validateQrCode", {
    qrCode,
    userId
  }, { headers: authHeader() }).then((response)=>{
      if(response.data.validated){
        localStorage.setItem("validQrCode", JSON.stringify(response.data.validated));
      }
      return response.data;
  })
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  validateQrCode,
  getCurrentQrCodeStatus
};

export default AuthService;
