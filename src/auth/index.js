import { Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from 'react';

function Auth() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [cookies] = useCookies(["accessToken", "refreshToken"]);
  useEffect(() => {
    if(cookies.accessToken && cookies.refreshToken) {
      navigate('/');
    }else {
      setAuth(true);
    }
  }, [])
  return (
    auth && <Outlet />
  )
} 

export { Auth };