import axios from "axios";

export default axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_API_HOST}:${process.env.REACT_APP_SERVER_API_PORT}/`,
  headers: {
    'Content-Type': 'application/json',
  }
});
