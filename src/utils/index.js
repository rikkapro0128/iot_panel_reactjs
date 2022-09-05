import jwt_decode from "jwt-decode";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export function cacheImage(image, callback) {
  const InstaceImage = new Image();
  callback(true); // set is caching data image
  InstaceImage.onload = () => {
    callback(false); // set is cached image will be done
  }
  InstaceImage.src = image;
}

export function assignToken({ accessToken, refreshToken }, callback) {
  const payloadAccessToken = jwt_decode(accessToken);
  const payloadRefreshToken = jwt_decode(refreshToken);
  cookies.set("accessToken", accessToken, {
    path: "/",
    expires: new Date(payloadAccessToken.exp * 1000),
  });
  cookies.set("refreshToken", refreshToken, {
    path: "/",
    expires: new Date(payloadRefreshToken.exp * 1000),
  });
  callback(payloadRefreshToken);
}
