import '../src/assets/Css/App.css';
import React, { useEffect, useState } from 'react';
import { Container, Col } from 'react-bootstrap';

 import Login from "./typescript/Pages/login.tsx"
import Pagenotfound from "../src/typescript/Pages/Pagenotfound.tsx"
import NavBar from './typescript/Layout/Navbar.tsx';
import Sidebar from './typescript/Layout/Sidebar.tsx';
 import Addcenter from './typescript/Pages/Addcenter.tsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoutes from './PrivateRoutes/PrivateRoutes.js';
import Reservation from "./typescript/Pages/Reservation.tsx";
function App () {
  
  const [isSignedIn, setIsSignedIn] = useState(localStorage.getItem('isSignedIn') === 'true');
  const currentPath = window.location.pathname;
  const [bookingDetails,setBookingDetails] = useState({
    bookingType:"Player Booking",
    facilityType:"Tennis Court",
    bookingOccurence:"Single Booking",
    frequency:"",
    startDate:"",
    endDate:"",
    startTime:"",
    endTime:"",
    firstName:"",
    lastName:"",
    emailAddress:"",
    phoneNumber:"",
    notes:"",
  });
  useEffect(() =>
  {
    localStorage.setItem('isSignedIn', isSignedIn.toString());
    if(currentPath === "/")
    {
     
      setIsSignedIn(false);
    }
  },[isSignedIn])
  return (
      <Container fluid className='p-0'>
    <BrowserRouter>
      {isSignedIn && currentPath !== "/" ? <NavBar isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} /> : null}
      <div className=' w-100  d-flex  '>
        {isSignedIn && currentPath !== "/" ? (
          <Col sm={12} md={3} lg={2} xl={2} className='vh-100 p-2'>
            <Sidebar currentPath={currentPath}/>
          </Col>
        ) : null}
        <Col className={`${isSignedIn && currentPath !== "/" ? "col-md-9 col-lg-10 col-xl-10 px-2 " : "col-12 w-100 vh-100"} bg-gainsboro   `} >
          <Routes>
            <Route path="/" element={<Login setIsSignedIn={setIsSignedIn} />} />
            <Route element={<PrivateRoutes isSignedIn={isSignedIn} />} >
              <Route path="/center" element={<Addcenter />} />
              <Route path="/reservation" element={<Reservation bookingDetails={bookingDetails} setBookingDetails={setBookingDetails}/>} />
            </Route>
              <Route path="*" element={<Pagenotfound/>} />
          </Routes>
        </Col>
      </div>
    </BrowserRouter>
  </Container>
    
  );
}

export default App;
