import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "@/page";
import Login from "@/page/login"; 
import Register from "@/page/register"; 
import { Auth } from '@/auth/index.js';

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="sign" element={<Auth />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
