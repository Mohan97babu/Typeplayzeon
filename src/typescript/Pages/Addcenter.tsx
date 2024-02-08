import NavBar from "../Layout/Navbar.tsx";
import { Container, Row, Col, Card } from "react-bootstrap";
import Sidebar from "../Layout/Sidebar.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";


const Addcenter: React.FC = ({setOrgDetails}) => {
  const [centerData, setCenterData] = useState({});
  
  const navigate = useNavigate();

  let orgId = localStorage.getItem("orgId");
  const tempURL = process.env.REACT_APP_BASEURLTEMP;
  const orgURL = process.env.REACT_APP_BASEURLORG;
  useEffect(() => {
    axios.get(`${tempURL}/api/account`)
    .then((response => {setOrgDetails(response.data); localStorage.setItem("orgId",response.data.orgId)}))
    .catch(err => console.log(err))

    if(orgId !== null) 
    {
      axios.get(`${tempURL}/api/v1/centers?organizationId.equals=${orgId}`, { headers: { "ngrok-skip-browser-warning": "true" } },)
        .then((response) => {setCenterData(response.data); console.log(response)})
        .catch((err) => console.log(err))
    }
  }, [])
  const handleReservation =(center: { id: string; }) =>
  {
    localStorage.setItem("centerId",center.id)
    navigate("/reservation");
  }
 // console.log(centerData,"photos");
  
  return (
    <>

      <div style={{ backgroundColor: "gainsboro" }}>
        <div className="mt-2  fw-bold">Center </div>
        <hr className="mt-1 ms-2" />
        <Card className=" bg-white p-3 rounded-3">
          <div className="row">
            {Array.isArray(centerData) && centerData.map((center) => {
              
              return (
                <div style={{ width: '15rem',height:"227px"}} key={center.id} className="m-xl-3 mx-auto my-2 col-sm-6 col-md-6 col-lg-3 col-xl-3 border rounded-2 px-0 " onClick={() => handleReservation(center)}>
                 {center?.photos[0]?.url ? <Card.Img src={center.photos[0].url} className="px-0  mb-0 card-img"/> : <Card.Title className=" bg-gainsboro card-img text-black mb-0 d-flex align-items-end fs-6 "><span className="ms-3 mb-2">{center.title}</span></Card.Title>} 
                 
                  <Card.Body className="p-2 fs-7 hover-border1 ">
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
                  </Card.Body>
                    
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