
import React, { useState, useEffect } from 'react';
import { Card,Placeholder } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Center {
  id: string;
  photos: { url: string }[];
  streetAddress: string;
  suite: string;
  city: string;
  stateProvince: string;
  centerHours: { weekday: string }[];
}

interface AddCenterProps {
  setOrgDetails: (details: any) => void;
}

const AddCenter: React.FC<AddCenterProps> = ({ setOrgDetails }) => {
  const [centerData, setCenterData] = useState<Center[]>([]);
  const [spinner,setSpinner] = useState(true);
  const navigate = useNavigate();
  const orgId = localStorage.getItem("orgId");
  const tempURL = process.env.REACT_APP_BASEURLTEMP;

  const formatDays = (inputString) => {
    if (!inputString || inputString.trim() === '') {
      return '';
  }
  if (!inputString.includes(',')) {
      return inputString;
  }
    console.log(inputString,"fdcd");
     const toArray = inputString?.split(",")     
    const dayCode = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];   
    const startDayIndex = dayCode.indexOf(toArray[0]);
    let isConsecutive = true;   
    for (let i = 1; i < toArray.length; i++) {
      const currentDayIndex = dayCode.indexOf(toArray[i]);
      if (currentDayIndex !== (startDayIndex + i) % 7) {
        isConsecutive = false;
        break;
      }}   
    if (isConsecutive) {
      return `${toArray[0]}-${toArray[toArray.length - 1]}`;
    }   
    if (toArray.length === 7) {
      return "Mon-Sun";
    }    
    return inputString;
  };
useEffect(() => {
  axios.get(`${tempURL}/api/account`)
    .then(response => {

      setOrgDetails(response.data);
      localStorage.setItem("orgId", response.data.orgId);
      localStorage.setItem("bookid",response.data.id);
      localStorage.setItem("first",response.data.firstName);
      localStorage.setItem("last",response.data.lastName);
      localStorage.setItem("orgName",response.data.orgName);


    })
    .catch(err => console.log(err));

  if (orgId) {
    axios.get(`${tempURL}/api/v1/centers?organizationId.equals=${orgId}`, { headers: { "ngrok-skip-browser-warning": "true" } })
      .then(response => {
        setCenterData(response.data);
        console.log(response.data); 
        setSpinner(false);
      })
      .catch(err => console.log(err));
  }
}, [orgId, setOrgDetails, tempURL]);

const handleReservation = (centerId: string) => {
  localStorage.setItem("centerId", centerId);
  navigate("/reservation");
};

return (
  <>
    <div style={{ backgroundColor: "gainsboro" }}>
      <div className="mt-2 fw-bold">Center</div>
      <hr className="mt-1 ms-2" />
      {spinner ? <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={12} />
          </Placeholder>
          <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={12} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
        </Card.Body>
      </Card> :<Card className="bg-white p-3 rounded-3">
        <div className="row">
          {centerData?.map((center) => (
            <div key={center.id} style={{ width: '15rem', height: "227px" }} className="m-xl-3 mx-auto my-2 col-sm-6 col-md-6 col-lg-3 col-xl-3 border rounded-2 px-0 " onClick={() => handleReservation(center.id)}>
              {center.photos[0]?.url ? <Card.Img src={center.photos[0].url} className="px-0 mb-0 card-img" /> : <Card.Title className="bg-gainsboro card-img text-black mb-0 d-flex align-items-end fs-6 "><span className="ms-3 mb-2">{center?.title}</span></Card.Title>}
              <Card.Body className="p-3  fs-7 hover-border1  ">
                <div>
                  <div className="mb-2 mt-1">{center.streetAddress},<span className="text-truncate">{center.suite}</span></div>
                  <div> {center.city},{center.stateProvince}</div>
                </div>
                <div className="my-3 ">
                  <div>
                    <div className="text-secondary fw-bold">Business hours</div>
                    {formatDays(center?.centerHours[0]?.weekday)}
                    :<span> {center?.centerHours[0]?.startTime} To</span> {center?.centerHours[0]?.endTime}

                  </div>
                </div>
              </Card.Body>
            </div> ))}
        </div>
      </Card>}
    </div>
  </>
);
};

export default AddCenter;