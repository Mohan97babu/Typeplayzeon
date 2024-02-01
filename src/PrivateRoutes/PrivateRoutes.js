import {Outlet,useNavigate} from "react-router-dom";
const PrivateRoutes =({isSignedIn}) =>
{
    const navigate = useNavigate();
  if(isSignedIn)
  {
    return <Outlet />;
  }
  else
  {
    navigate("/");
    return null;
  }
}
export default PrivateRoutes