import NavBar from "../Layout/Navbar.tsx";
import { Container, Row, Col, Card } from "react-bootstrap";
import Sidebar from "../Layout/Sidebar.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";


const Addcenter: React.FC = () => {
  const [centerData, setCenterData] = useState({});
  const navigate = useNavigate();

  let storage = localStorage.getItem("AccessToken");
  const tempURL = process.env.REACT_APP_BASEURLTEMP;
  const orgURL = process.env.REACT_APP_BASEURLORG;
  useEffect(() => {
    axios.get(`${tempURL}/api/v1/centers?organizationId.equals=64751`, { headers: { "ngrok-skip-browser-warning": "true", Authorization: `Bearer ${storage}` } },)
      .then((response) => setCenterData(response.data))
      .catch((err) => console.log(err))
  }, [])
  const handleReservation =(center: { id: string; }) =>
  {
    localStorage.setItem("centerId",center.id)
    navigate("/reservation");
  }
  console.log(centerData,"photos");
  
  return (
    <>

      <div style={{ backgroundColor: "gainsboro" }}>
        <div className="mt-2  fw-bold">Center </div>
        <hr className="mt-1 ms-2" />
        <Card className=" bg-white p-3 rounded-3">
          <div className="row">
            {Array.isArray(centerData) && centerData.map((center) => {
              { console.log(center?.photos[0]?.url,"map")}
              return (
                <div style={{ width: '15rem',height:"18rem" }} key={center.id} className="m-3 col-sm-6 col-md-6 col-lg-3 col-xl-3 border rounded-2 px-0" onClick={() => handleReservation(center)}>
                 {center?.photos[0]?.url ? <Card.Img src={center.photos[0].url} className="px-0 h-50 mb-0"/> : <Card.Title className=" bg-dark text-white mb-0">{center.title}</Card.Title>} 
                  <div className="p-2 fs-6">
                    <div>
                      <div className="mb-2">
                        {center.streetAddress},<span className="text-truncate">{center.suite}</span>
                      </div>
                      <div>
                        {center.city},{center.stateProvince}
                      </div>
                    </div>
                    <div className="my-3">
                      <div >
                        <div className="text-secondary fw-bold">Business hours</div>
                        {center.streetAddress},<span className="text-truncate">{center.suite}</span>
                      </div>
                      <div>
                        {center.city},{center.stateProvince}
                      </div>
                    </div>
                  </div>
                </div>

              )
            })

            }
          </div>
        </Card>
      </div>
    </>
  )
}
export default Addcenter