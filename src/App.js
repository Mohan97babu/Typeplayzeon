import './App.css';
import React from 'react';
import { Container,Row } from 'react-bootstrap';
import backImg1 from "../src/assets/images/R.png";
import Login from "../src/typescript/login.tsx"
import logo1 from "../src/assets/images/logobgremove.png";
import NavBar from './typescript/Layout/Navbar.tsx';
import Sidebar from './typescript/Layout/Sidebar.tsx';
function App() {
  return (
    <>
    {/* <div className="App vh-100 d-flex justify-content-center bg-dark ">
    
  </div> */}
  {/* <Login />  */}
      {/* <NavBar /> */}
      <Sidebar />
    </>
  );
}

export default App;
