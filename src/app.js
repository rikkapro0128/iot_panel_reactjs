import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import history from '@/instance/history.js';

import HomePage from "@/page";
import Login from "@/page/login"; 
import Register from "@/page/register"; 
import Dashboard from "./page/dashboard";
import { Auth, Protect } from '@/auth';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App () {

  return (
    <HistoryRouter history={history}>
      <Routes>
        <Route path="/" element={<Auth navigateTo='/dashboard/general' isToast={false} />}>
          <Route path="/" element={<HomePage />} />
        </Route>
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
    </HistoryRouter>
  )

}

export default App;
