import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "@/page";
import Login from "@/page/login"; 
import Register from "@/page/register"; 
import Dashboard from "./page/dashboard";
import { Auth, Protect } from '@/auth';

function App () {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/dashboard/*" element={
          <Protect>
            <Dashboard />
          </Protect> 
        }></Route>
        <Route path="/sign" element={<Auth />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )

}

export default App;
