import React, { useState, ChangeEvent } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo1 from "../../assets/images/LogoNav.png";

interface LoginDetails {
  userName: string;
  password: string;
}

const Login: React.FC<{setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>}> = ({setIsSignedIn}) => {
  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    userName: "",
    password: "",
  });
const tempURL = process.env.REACT_APP_BASEURLTEMP;
const orgURL = process.env.REACT_APP_BASEURLORG;
const navigate = useNavigate();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginDetails({ ...loginDetails, [event.target.name]: event.target.value });
    
  };
  const handleSubmit = async () =>
  {
     await axios.post(`${tempURL}/api/user-management/login`,loginDetails)
    .then((response) => {
      console.log(response,"65655")
      localStorage.setItem("AccessToken",response.data.accessToken);
       navigate("/center"); setIsSignedIn(true); })
    .catch((err) => console.log(err))
  }

  return (
    <Container fluid className="App vh-100  bg-dark "> 
      <div className=' p-2 bg-dark'>
        <img src={logo1}  width="200" height="60" alt="...."/>
      </div>
    <div className="  d-flex justify-content-center align-items-center ">
      <Container fluid>
        <Row>
          <Row className="p-2  mt-5">
            <Col xs={7} md={5} lg={7} xl={7} className="text-center text-white d-flex justify-content-center align-items-center d-none d-sm-none d-md-block my-auto ">
              <div>
                <div className="mx-5">
                  <span className="fw-normal fs-3 ">Book Sports Center</span>
                <hr  />
                </div>
                <div className="mx-5">
                  <span className="fw-normal fs-3">Connect with other players</span> 
                <hr />
                </div>
                <div>
                  <span className="fw-normal fs-3">Sign up for Lessons</span>
                </div>
              </div>
            </Col>
            <Col xs={4} sm={12} md={7} lg={4} xl={4} className=" text-white  p-4 rounded-2" style={{ backgroundColor: "whitesmoke" }}>
              {/* <div className="d-flex justify-content-center">
                  <img src={logo1} width={200} height={100} />
                </div> */}
              <label className="my-2 text-black">Email Address</label>
              <input type="email" className="form-control " name="userName" onChange={(e) => handleChange(e)} placeholder="Email Address" value={loginDetails.userName} />
              <label className="my-2 text-black">Password</label>
              <input type="password" className="form-control " name="password" onChange={(e) => handleChange(e)} placeholder="Password" value={loginDetails.password} />
              <div className="d-flex justify-content-end mt-3 text-danger">Forgot Password?</div>
              <div>
                <Button variant="danger" className="  w-100 my-3 shadow-3" onClick={() =>handleSubmit()}>
                  Sign in
                </Button>
              </div>
              <Row className="py-1">
                <Col>
                  <div className="text-black">Don't have an Account?</div>
                  <h6 className="text-danger">Sign Up</h6>
                </Col>
                <Col>
                  <div className="text-black">Are you an Organization?</div>
                  <h6 className="text-danger">Partner with us</h6>
                </Col>
              </Row>
            </Col>
          </Row>
        </Row>
      </Container>
    </div>
    </Container>
  );
};

export default Login;