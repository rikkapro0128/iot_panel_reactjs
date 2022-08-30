/* eslint-disable no-restricted-globals */
import axios from "axios";
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
import { Toast } from "@/instance/toast.js";
import history from "@/instance/history.js";

const cookies = new Cookies();

const pathRefreshToken = "api/user/refresh-token";
const defaultOptions = {
  "Content-Type": "application/json",
};

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_API_HOST}:${process.env.REACT_APP_SERVER_API_PORT}/`,
  headers: defaultOptions,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers["authorization"] = cookies.get("accessToken") || "";
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errorMessage = error.response.data.message;
    if (
      errorMessage === "not found header authorization!" ||
      errorMessage === "token is expire!"
    ) {
      const statusResfresh = await refreshAccessToken();
      if (statusResfresh) {
        return instance(originalRequest);
      } else {
        // navigate to login
        Toast({
          type: "error",
          message: "Phiên đăng nhập đã hết bạn đăng nhập lại nhé!",
        });
        history.push("/sign/login");
      }
    }
    return Promise.reject(error);
  }
);

async function refreshAccessToken() {
  try {
    const refreshToken = cookies.get("refreshToken");
    if (refreshToken) {
      const res = await instance.get(pathRefreshToken, {
        headers: { "ref-token": refreshToken },
      });
      const payloadAccessToken = jwt_decode(res.data.token);
      cookies.set("accessToken", res.data.token, {
        path: "/",
        expires: new Date(payloadAccessToken.exp * 1000),
      });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default instance;
