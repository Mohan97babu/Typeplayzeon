import React, { useState, ChangeEvent } from "react";
import { Container, Row, Col, Button,Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo1 from "../../assets/images/LogoNav.png";
import { Formik } from "formik";
import * as yup from "yup";
import InputField from "../components/CommonInputs/InputField";
import Swal from "sweetalert2";

const Login: React.FC<{setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>}> = ({setIsSignedIn}) => {

  const [spinner,setSpinner] =useState(false);
 const tempURL = process.env.REACT_APP_BASEURLTEMP;
const orgURL = process.env.REACT_APP_BASEURLORG;
const navigate = useNavigate();
  const schema =yup.object().shape({
    userName:yup.string().email().required(),
    password:yup.string().required(),
  })
  const handleLoginSubmit = async (values) =>
  {
     await axios.post(`${tempURL}/api/user-management/login`,values)
    .then((response) => {
      console.log(response,"65655")
     localStorage.setItem("AccessToken",response.data.accessToken);
       setIsSignedIn(true);
       setSpinner(true); 
       Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `Welcome back`,
      });navigate("/center"); })
    .catch((err) => {console.log(err);Swal.fire({
      icon: 'error',
      title: 'Login Failed!',
      text: 'Invalid EmailAddress or password.',
    });})
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
                <div className="mx-5"><span className="fw-normal fs-3 ">Book Sports Center</span><hr  /> </div>
                <div className="mx-5"><span className="fw-normal fs-3">Connect with other players</span>  <hr /></div>
                <div> <span className="fw-normal fs-3">Sign up for Lessons</span></div>
              </div>
            </Col>
            <Col  sm={12} md={7} lg={4} xl={4} className=" text-white  p-4 rounded-2" style={{ backgroundColor: "whitesmoke" }}>
                <Formik
                validationSchema={schema}
                onSubmit={handleLoginSubmit}
                initialValues={{
                  userName:"",
                  password:"",
                }}
                >
               {({handleSubmit,handleChange,values,errors})=>(
                <Form onSubmit={handleSubmit}>
              <InputField label={"Email Address"} labelClassName={"text-black my-2"} type={"email"} name={"userName"} onChange={handleChange} placeholder={"Enter Email Address"} value={values.userName} errors={errors.userName}/>
              <InputField label={"Password"} labelClassName={"text-black my-2"} type={"password"} name={"password"} onChange={handleChange} placeholder={"Enter Password"} value={values.password} errors={errors.password}/>
              <div className="d-flex justify-content-end mt-3 text-danger">Forgot Password?</div>
              <div>
                <Button variant="danger" className="  w-100 my-3 shadow-3" type="submit">
                  Sign in
                  <div>{spinner ? <Spinner animation="border" variant="danger" size="sm" /> : null}</div>
                </Button>
               </div>
                </Form>
               )}             
                </Formik>
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