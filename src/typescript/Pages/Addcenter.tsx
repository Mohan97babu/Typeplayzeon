// import NavBar from "../Layout/Navbar.tsx";
// import { Container, Row, Col, Card } from "react-bootstrap";
// import Sidebar from "../Layout/Sidebar.tsx";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import React from "react";
// import { useNavigate } from "react-router-dom";


// const Addcenter: React.FC = ({ setOrgDetails }) => {
//   const [centerData, setCenterData] = useState({});

//   const navigate = useNavigate();

//   let orgId = localStorage.getItem("orgId");
//   const tempURL = process.env.REACT_APP_BASEURLTEMP;
//   const orgURL = process.env.REACT_APP_BASEURLORG;
//   useEffect(() => {
//     axios.get(`${tempURL}/api/account`)
//       .then((response => { setOrgDetails(response.data); localStorage.setItem("orgId", response.data.orgId) }))
//       .catch(err => console.log(err))

//     if (orgId !== null) {
//       axios.get(`${tempURL}/api/v1/centers?organizationId.equals=${orgId}`, { headers: { "ngrok-skip-browser-warning": "true" } },)
//         .then((response) => { setCenterData(response.data); console.log(response) })
//         .catch((err) => console.log(err))
//     }
//   }, [])
//   const handleReservation = (center: { id: string; }) => {
//     localStorage.setItem("centerId", center.id)
//     navigate("/reservation");
//   }
//   // console.log(centerData,"photos");
//   const displayDays = (shortdays: any,index :any) => {
//     if (!shortdays) return ""; // Return empty string if shortdays is null or undefined
//     const daysArray = shortdays.split(",").map((day) => day.trim());
//     console.log([index],"index")
//     return daysArray.join(", ");
//   };




//   return (
//     <>

//       <div style={{ backgroundColor: "gainsboro" }}>
//         <div className="mt-2  fw-bold">Center </div>
//         <hr className="mt-1 ms-2" />
//         <Card className=" bg-white p-3 rounded-3">
//           <div className="row">
//             {Array.isArray(centerData) && centerData.map((center, index) => {
//               console.log(center?.centerHours[index]?.weekday,"weekie")
//               return (
//                 <div style={{ width: '15rem', height: "227px" }} key={center.id} className="m-xl-3 mx-auto my-2 col-sm-6 col-md-6 col-lg-3 col-xl-3 border rounded-2 px-0 " onClick={() => handleReservation(center)}>
//                   {center?.photos[0]?.url ? <Card.Img src={center.photos[0].url} className="px-0  mb-0 card-img" /> : <Card.Title className=" bg-gainsboro card-img text-black mb-0 d-flex align-items-end fs-6 "><span className="ms-3 mb-2">{center.title}</span></Card.Title>}

//                   <Card.Body className="p-2 fs-7 hover-border1 ">
//                     <div>
//                       <div className="mb-2">
//                         {center.streetAddress},<span className="text-truncate">{center.suite}</span>
//                       </div>
//                       <div>
//                         {center.city},{center.stateProvince}
//                       </div>
//                     </div>
//                     <div className="my-3">
//                       <div >
//                         <div className="text-secondary fw-bold">Business hours</div>
//                         {center.streetAddress},<span className="text-truncate">{center.suite}</span>
//                       </div>
//                       <div>
//                         {center.city},{center.stateProvince}
//                       </div>
//                       {displayDays(center?.centerHours[index]?.weekday ,index)}
//                     </div>
//                   </Card.Body>

//                 </div>

//               )
//             })

//             }
//           </div>
//         </Card>
//       </div>
//     </>
//   )
// }
// export default Addcenter
import React, { useState, useEffect } from 'react';
import { Card } from "react-bootstrap";
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
  const navigate = useNavigate();
  const orgId = localStorage.getItem("orgId");
  const tempURL = process.env.REACT_APP_BASEURLTEMP;

  // Function to format days
  // const formatDays = (inputString: string ): string => {
  //   console.log(inputString,"infun");

  //   if (!inputString) return ""; // Return empty string if inputString is null or undefined

  //   const dayMap: { [key: string]: string } = {
  //     'mon': 'Monday',
  //     'tue': 'Tuesday',
  //     'wed': 'Wednesday',
  //     'thur': 'Thursday',
  //     'fri': 'Friday',
  //     'sat': 'Saturday',
  //     'sun': 'Sunday'
  //   };

  //   const daysArray = inputString.split(",").map(day => day.trim());
  //   daysArray.sort();

  //   let consecutiveDays: string[] = [];
  //   let consecutiveCount = 1;

  //   for (let i = 0; i < daysArray.length; i++) {
  //     if (i < daysArray.length - 1 && daysArray[i + 1].charCodeAt(0) - daysArray[i].charCodeAt(0) === 1) {
  //       consecutiveCount++;
  //     } else {
  //       if (consecutiveCount > 1) {
  //         consecutiveDays.push(`${dayMap[daysArray[i - consecutiveCount + 1]]}-${dayMap[daysArray[i]]}`);
  //         consecutiveCount = 1;
  //       } else {
  //         consecutiveDays.push(dayMap[daysArray[i]]);
  //       }
  //     }
  //   }

  //   return consecutiveDays.join(", ");
  // };
  // const formatDays = (inputString: string | undefined): string => {
  //   if (!inputString) return ""; // Return empty string if inputString is null or undefined


  //   const daysArray = inputString.split(",");

  //   // Join the days with commas
  //   return daysArray.join(",");
  // };
  // const formatDays = (inputString) => {
  //   const toArray = inputString.split(",");
  //   console.log(toArray, "arr");

  //   const dayCode = [
  //     { key: "0", value: "Mon" },
  //     { key: "1", value: "Tue" },
  //     { key: "2", value: "Wed" },
  //     { key: "3", value: "Thur" },
  //     { key: "4", value: "Fri" },
  //     { key: "5", value: "Sat" },
  //     { key: "6", value: "Sun" },
  //   ];



  //   // Iterate over the input days
  //   for (let i = 0; i < toArray.length; i++) {

  //     console.log(dayCode[i]?.value,i, "day");
  //     if (dayCode[i].value === toArray[i]) {

  //       if (toArray[i] === toArray[i + 1]) {

  //         return `${dayCode[0].value}-${dayCode[i].value}`;                 
  //       } 
  //       else {      
  //         return toArray;     
  //       }

  //     }

  //   }
  // };
  const formatDays = (inputString) => {

    const toArray = inputString.split(",");
    console.log(toArray, "arr")
    const dayCode = [
      { key: "0", value: "Mon" },
      { key: "1", value: "Tue" },
      { key: "2", value: "Wed" },
      { key: "3", value: "Thur" },
      { key: "4", value: "Fri" },
      { key: "5", value: "Sat" },
      { key: "6", value: "Sun" },
    ]
    console.log(dayCode[0]?.value, "day");
    for (let i = 0; i < inputString.length; i++) 
    {
      if (dayCode[i].value === toArray[i]) 
      {
        if (dayCode[i].value !== toArray[i + 1]) 
        {
          return `${dayCode[0]} - ${dayCode[inputString.length - 1]}`;

        }

      }

      else{
  return inputString
  }
    }

  
  }





useEffect(() => {
  axios.get(`${tempURL}/api/account`)
    .then(response => {

      setOrgDetails(response.data);
      localStorage.setItem("orgId", response.data.orgId);
    })
    .catch(err => console.log(err));

  if (orgId) {
    axios.get(`${tempURL}/api/v1/centers?organizationId.equals=${orgId}`, { headers: { "ngrok-skip-browser-warning": "true" } })
      .then(response => {
        setCenterData(response.data);
        console.log(response.data); // Ensure you're receiving the correct data
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
      <Card className="bg-white p-3 rounded-3">
        <div className="row">
          {centerData.map((center) => (
            <div key={center.id} style={{ width: '15rem', height: "227px" }} className="m-xl-3 mx-auto my-2 col-sm-6 col-md-6 col-lg-3 col-xl-3 border rounded-2 px-0 " onClick={() => handleReservation(center.id)}>
              {center.photos[0]?.url ? <Card.Img src={center.photos[0].url} className="px-0 mb-0 card-img" /> : <Card.Title className="bg-gainsboro card-img text-black mb-0 d-flex align-items-end fs-6 "><span className="ms-3 mb-2">{center.title}</span></Card.Title>}
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
                  <div>
                    <div className="text-secondary fw-bold">Business hours</div>

                    {console.log(center?.centerHours[0]?.weekday, "df")}
                    {formatDays(center?.centerHours[0]?.weekday)}

                  </div>
                </div>

              </Card.Body>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </>
);
};

export default AddCenter;