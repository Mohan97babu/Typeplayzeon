import axios from "axios";
import { Navigate } from "react-router-dom";


const interceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const accesstoken = localStorage.getItem("AccessToken");
      if (accesstoken) {
        config.headers["Authorization"] = ` Bearer ${accesstoken}`
        config.headers["ngrok-skip-browser-warning"] = `true`
      }
      else {
        <Navigate to="/" />
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) =>
      error?.response.data.message
  );
}
export default interceptors