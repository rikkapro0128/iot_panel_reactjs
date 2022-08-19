/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Toast } from '@/instance/toast.js';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

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

export function Protect({ children }) {
  const navigate = useNavigate();
  const [statusProtect, setStatusProtect] = useState(false);
  useEffect(() => {
    const accessToken = cookies.get('accessToken');
    if(accessToken) {
      setStatusProtect(true);
    }else {
      const refreshToken = cookies.get('refreshToken');
      if(refreshToken) {
        setStatusProtect(true);
      }else {
        setStatusProtect(false);  
        navigate('/');
        Toast({ type: 'error', message: 'Bạn cần phải đăng nhập!' });
      }
    }
  }, [])
  return (
    statusProtect && children
  )
}

export { Auth };