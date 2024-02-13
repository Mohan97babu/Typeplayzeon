import '../src/assets/Css/App.css';
import React, { useEffect, useState } from 'react';
import { Container, Col } from 'react-bootstrap';

 import Login from "./typescript/Pages/login.tsx"
import Pagenotfound from "./typescript/Pages/Pagenotfound.tsx"
import NavBar from './typescript/Layout/Navbar.tsx';
import Sidebar from './typescript/Layout/Sidebar.tsx';
 import Addcenter from './typescript/Pages/Addcenter.tsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoutes from './PrivateRoutes/PrivateRoutes.js';
import Reservation from "./typescript/Pages/Reservation.tsx";
interface bookingDetails
{
   bookingType:string;
   facilityType:string;
   bookingOccurence:string;
   frequency:string;
    startDate:Date | null;
    endDate:Date | null;
    startTime:string;
    endTime:string;
    firstName:string;
    lastName:string;
    emailAddress:string;
    phoneNumber:string;
    pricingRule:string,
    facilities:string,
    notes:string;
    facilityCheck:string;
    pricingRuleCheck:string;
}
function App () {
  
  const [isSignedIn, setIsSignedIn] = useState(localStorage.getItem('isSignedIn') === 'true');
  const [orgDetails,setOrgDetails] = useState({});
  const currentPath = window.location.pathname;
  const [bookingDetails,setBookingDetails] = useState<bookingDetails>({
    bookingType:"Player Booking",
    facilityType:"Tennis Court",
    bookingOccurence:"Single Booking",
    frequency:"",
    startDate:null,
    endDate:null,
    startTime:"",
    endTime:"",
    firstName:"",
    lastName:"",
    emailAddress:"",
    phoneNumber:"",
    pricingRule:"",
    facilities :"",
    notes:"",
    facilityCheck:"",
    pricingRuleCheck:"",
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
      {isSignedIn && currentPath !== "/" ? <NavBar setIsSignedIn={setIsSignedIn} orgDetails={orgDetails}/> : null}
      <div className=' w-100  d-flex  '>
        {isSignedIn && currentPath !== "/" ? (
          <Col sm={12} md={3} lg={2} xl={2} className='vh-100 p-2 d-none d-sm-none d-md-block'>
            <Sidebar currentPath={currentPath} />
          </Col>
        ) : null}
        <Col className={`${isSignedIn && currentPath !== "/" ? "col-md-9 col-lg-10 col-xl-10 px-2 " : "col-12 w-100 vh-100"} bg-gainsboro   `} >
          <Routes>
            <Route path="/" element={<Login setIsSignedIn={setIsSignedIn} />} />
            <Route element={<PrivateRoutes isSignedIn={isSignedIn} />} >
              <Route path="/center" element={<Addcenter setOrgDetails={setOrgDetails} />} />
              <Route path="/reservation" element={<Reservation bookingDetails={bookingDetails} setBookingDetails={setBookingDetails}/>} />
            </Route>
              <Route path="*" element={<Pagenotfound/>} />
          </Routes>
        </Col>
      </div>
    </BrowserRouter>
  </Container>
 //  <Reservation bookingDetails={bookingDetails} setBookingDetails={setBookingDetails} />
    
  );
}

export default App;
