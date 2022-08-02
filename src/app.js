import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./page";
import Sign from "./page/sign"; 
import Login from "./page/login"; 
import Register from "./page/register"; 

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="sign" element={<Sign />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
