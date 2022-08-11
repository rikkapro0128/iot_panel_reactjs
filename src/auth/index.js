import { Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Loader } from "rsuite";
import { useEffect, useState } from 'react';
import { Toast } from '@/instance/toast.js';
import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';
import api from '@/api/index.js';

const cookies = new Cookies();
const pathRefreshToken = 'api/user/refresh-token'

function Auth() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    const accessToken = cookies.get('accessToken');
    const refreshToken = cookies.get('refreshToken');
    if(accessToken || refreshToken) {
      navigate('/');
      Toast({ type: 'error', message: 'Bạn đã đăng nhập rồi mà!'});
    }else {
      setAuth(true);
    }
  }, [])
  return (
    auth && <Outlet />
  )
} 

const refreshTokenHandler = async ({ token, navigate, callback }) => {
  try {
    const res = await api.get(pathRefreshToken, { headers: { 'ref-token': token } });
    if(res.data.message === 'refresh token is successfull!') {
      const accessToken = res.data.token;
      const payloadAccessToken = jwt_decode(accessToken);
      cookies.set('accessToken', res.data.token, { path: '/', expires: new Date(payloadAccessToken.exp * 1000) });
      callback(true);
    } 
  } catch (error) {
    if(error.response.data.message === 'token is expire!') {
      navigate('/');
      Toast({ type: 'error', message: 'Phiên đăng nhập đã hết. Bạn cần phải đăng nhập!' });
    }
  }
}

export function Protect({ children }) {
  // const navigate = useNavigate();
  // const [statusProtect, setStatusProtect] = useState(false);
  // useEffect(() => {
  //   const accessToken = cookies.get('accessToken');
  //   const refreshToken = cookies.get('refreshToken');
  //   if(accessToken) {
  //     setStatusProtect(true);
  //   }else if(refreshToken) {
  //     refreshTokenHandler({ token: refreshToken, navigate, callback: (state) => { setStatusProtect(state) } });
  //   }else {
  //     Toast({ type: 'error', message: 'Bạn cần phải đăng nhập!' });
  //     navigate('/');
  //   }
  // }, [])
  return (
    children 
    // statusProtect 
    // ? children 
    // : <Loader
    //     size="md"
    //     className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]"
    //     content="Loading..."
    //   />
  )
}

export { Auth };