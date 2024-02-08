import { Col, Row, Form, Button, Offcanvas } from "react-bootstrap";
import { Icon } from "@iconify/react";
import React, { useState, ChangeEvent, useEffect } from "react";
import Select from 'react-select';
import { FacilityType, BookingType } from "../../utils/Data";
import { Time } from "../../utils/Data";
import Moment from "react-moment";
import moment from "moment";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, momentLocalizer ,Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../assets/Css/App.css";
import { Formik } from "formik";
import * as yup from "yup";

interface bookingDetails {
    bookingType: string;
    facilityType: string;
    bookingOccurence: string;
    frequency: string;
    startDate: Date | null;
    endDate: Date | null;
    startTime: string;
    endTime: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    notes: string;
}
interface calendarDetails {
    facilityType: string;
    facilities: string;
    date: string;
    sportsId: any
}
interface apiResponse {
    facilityType: any[];
    facilities: any;
    pricingrule: [];
}

const Reservation: React.FC<{ bookingDetails: bookingDetails, setBookingDetails: React.Dispatch<React.SetStateAction<bookingDetails>> }> = ({ bookingDetails, setBookingDetails }) => {
    const [show, setShow] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    // const [facilityType,setFacilityType] = useState([]);
    const [calendarDetails, setCalendarDetails] = useState<calendarDetails>({
        facilityType: "",
        facilities: "",
        date: "",
        sportsId: ""
    })
    console.log(calendarDetails.date, "457")
    const [facility, setFacility] = useState<string>("")
    const [apiResponse, setApiResponse] = useState<apiResponse>({
        facilityType: [],
        facilities: {},
        pricingrule: []
    })
    const centerId = localStorage.getItem("centerId");
    const schema = yup.object().shape({
        firstName :yup.
    })
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const tempURL = process.env.REACT_APP_BASEURLTEMP;
    const orgURL = process.env.REACT_APP_BASEURLORG;
    const handleSubmit = () => {

        console.log(bookingDetails);
    }
    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        //   const { name, value } = e.target;
        setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
        if (e.target.name === "bookingOccurence" ) {
            setBookingDetails({ ...bookingDetails, startDate: null, endDate: null, startTime: "", endTime: "" })
        }

    }
    const listFacilities = async (sportsId: any) => {
        await axios.get(`${tempURL}/api/v1/facilities?sportId.equals=${sportsId}&centerId.equals=${centerId}`)
            .then((response) => setApiResponse((prev) => ({ ...prev, facilities: response.data })))
            .catch((err) => console.log(err))
    }
    const handleCalendarChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>, sportsId: any) => {

        const selectedFacilityTitle = e.target.value;
        const selectedFacility = apiResponse.facilityType.find((facility) => facility.title === selectedFacilityTitle);
        sportsId = selectedFacility ? selectedFacility.sport.id : null;

        setCalendarDetails({
            ...calendarDetails,
            facilityType: selectedFacilityTitle,
            sportsId: sportsId
        });

        listFacilities(sportsId);

    }
    useEffect(() => {
        if (bookingDetails.bookingOccurence === "Single Booking") {

            setBookingDetails({ ...bookingDetails, endDate: bookingDetails.startDate });
        }


    }, [bookingDetails.startDate])
    useEffect(() => {
        const listSports = async () => {
            await axios.get(`${tempURL}/api/v1/sport-photos`)
                .then((response) => {
                    setApiResponse({ ...apiResponse, facilityType: response.data });
                    listFacilities(1)
                })
                .catch((err) => console.log(err));
        }
        listSports();
    }, []);

    const handleBookFacility = async (type: any) => {
        setFacility(type.name);
        await axios.get(`${tempURL}/api/v1/pricing-rules?centerId=${centerId}&facilityIds=${type?.[0]?.id}`)
            .then((response) => setApiResponse({ ...apiResponse, pricingrule: response.data }))
            .catch(err => console.log(err))
    }

    // const today = moment().format('L');
    // const dateToFormat = bookingDetails.startDate
    const handleReactSelectChange = (selectedOption: any, actionMeta: any) => {
        const name = actionMeta.name || 'defaultName';
        const value = selectedOption.value;
        if (name === 'startTime') {
            setStartTime(value);
        } else if (name === 'endTime') {
            setEndTime(value);
        }
        setBookingDetails({ ...bookingDetails, [name]: value });
    }
    const handleDateChange = (selectedDate: Date | null) => {

        if (bookingDetails.startDate === null) {

            setBookingDetails({ ...bookingDetails, startDate: selectedDate });
        }
        else {
            setBookingDetails({ ...bookingDetails, endDate: selectedDate })
        }
    };
    const localizer = momentLocalizer(moment);
    console.log(bookingDetails, "book")
    //  console.log(apiResponse, "apires")
    //  console.log(apiResponse.facilities,"fac")
    return (
        <div className="bg-white mt-2 rounded-2 ">
            <Row className="p-3">

                <Row className=" w-100" sm={12} md={10} lg={12} xl={12}>
                    <Col sm={12} md={12} lg={9} xl={7} className="d-lg-flex justify-content-lg-between justify-content-md-around" >
                        <div ><Icon icon="material-symbols:square" style={{ color: " #fc9403" }} /><span>Player/Not paid</span></div>
                        <div> <Icon icon="material-symbols:square" style={{ color: "yellow" }} /><span>Coach</span></div>
                        <div>  <Icon icon="material-symbols:square" style={{ color: "purple" }} /><span>Admin</span></div>
                        <div>    <Icon icon="material-symbols:square" style={{ color: "grey" }} /><span>Maintenance</span></div>
                        <div> <Icon icon="material-symbols:square" style={{ color: "alice" }} /><span>Tournament</span></div>
                        <div> <Icon icon="material-symbols:square" style={{ color: "green" }} /><span>Player/Paid</span> </div>
                    </Col>
                    <Col sm={12} lg={3} xl={5}>
                        <div className="fw-medium fs-5 text-lg-end">Booking Schedules</div>
                    </Col>
                </Row>
            </Row>
            <hr className="my-1" />
            {/* <Row className="p-3 d-flex">
                <Col sm={12} lg={4} xl={3}>
                    <label>Facility Type</label>
                    <Form.Select aria-label="Default select example" className="mt-2" value={calendarDetails.facilityType} name="facilityType" onChange={(e) => handleCalendarChange(e)}>
                        {Array.isArray(apiResponse.facilityType) && apiResponse.facilityType.map((facility: any) => {

                            const sportsId = facility.sport.id;
                            return (
                                <option value={facility.title} onClick={(e) => handleCalendarChange(e, sportsId)}>
                                    {facility.title}
                                </option>
                            );
                        })}
                    </Form.Select>
                </Col>
                <Col sm={12} lg={4} xl={3}>
                    <label>Facilities</label>
                    <Form.Select aria-label="Default select example" className="mt-2">
                        <option value={""}>All Court</option>
                        {Object.entries(apiResponse.facilities).map(([courtName, courtArray]) => (
                            courtArray.map((facilityItem, index) => (
                                <option key={`${courtName}-${index}`} value={facilityItem.name}>
                                    {facilityItem.name}
                                </option>
                            ))
                        ))}
                    </Form.Select>
                </Col>
                <Col sm={12} lg={4} xl={4} className="">
                    <Form.Group controlId="formBasicEmail"  >
                        <Form.Label className="mb-2">Date</Form.Label>
                        
                        <DatePicker className="form-control  " minDate={new Date()} showIcon />

                    </Form.Group>
                </Col>
                <Col xs={2} className="mt-3 ">

                    <div className="mt-3  " >

                        <Button variant="primary"> <Icon icon="ic:baseline-search" height={21} />Search </Button>
                        <Button variant="danger" className="ms-4" onClick={handleShow}>
                            Add Booking
                        </Button>
                    </div>

                </Col>    


                
            </Row> */}
            <Row className="p-3">
                <div className="d-md-flex justify-content-between">

                <Col sm={12} md={2} lg={2} xl={3}>
                    <label>Facility Type</label>
                    <Form.Select aria-label="Default select example" className="mt-2" value={calendarDetails.facilityType} name="facilityType" onChange={(e) => handleCalendarChange(e)}>
                        {Array.isArray(apiResponse.facilityType) && apiResponse.facilityType.map((facility: any) => {

                            const sportsId = facility.sport.id;
                            return (
                                <option value={facility.title} onClick={(e) => handleCalendarChange(e, sportsId)}>
                                    {facility.title}
                                </option>
                            );
                        })}
                    </Form.Select>
                </Col>
                <Col sm={12} md={2} lg={2} xl={3}>
                    <label>Facilities</label>
                    <Form.Select aria-label="Default select example" className="mt-2">
                        <option value={""}>All Court</option>
                        {Object.entries(apiResponse.facilities).map(([courtName, courtArray]) => (
                            courtArray.map((facilityItem, index) => (
                                <option key={`${courtName}-${index}`} value={facilityItem.name}>
                                    {facilityItem.name}
                                </option>
                            ))
                        ))}
                    </Form.Select>
                </Col>
                <Col sm={12} md={2} lg={2} xl={2} className="mt-2 ">                   
                        <label className="mb-2">Date</label>                        
                        <DatePicker className="form-control  " minDate={new Date()} showIcon />                  
                </Col>
                <div className="mt-3">
                <Col  className="mt-3 ">

                    <div className="mt-3  " >

                        <Button variant="primary"> <Icon icon="ic:baseline-search" height={21} />Search </Button>
                        <Button variant="danger" className="ms-4" onClick={handleShow}>
                            Add Booking
                        </Button>
                    </div>

                </Col>                    
                </div>
                </div>
            </Row>
          
            <Row className="p-2">
                <Calendar
                    localizer={localizer}
                    // events={myEventsList}
                    views={{day : true,week : true,month : true}}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView ={Views.DAY}
                    style={{ height: 550 }}
                />
            </Row>
            <Offcanvas show={show} onHide={handleClose} backdrop="static" placement="end" className=" w-75">
                <Offcanvas.Header className="bg-gainsboro" closeButton>
                    <Offcanvas.Title >Booking</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body >
                    <Row>
                        <Col sm={12} xl={8}>
                            <Row>
                                <Col  sm={12} xl={6}>
                                    <Form.Label className="fw-medium">Booking Type<span className="text-danger ms-1">*</span></Form.Label>
                                    <Form.Select aria-label="Default select example" name="bookingType" value={bookingDetails.bookingType} onChange={handleChange}>
                                        {BookingType.map((booking) => {
                                            return (
                                                <option value={booking.value}>{booking.label}</option>
                                            )
                                        })}
                                    </Form.Select>
                                </Col>
                                <Col sm={12} xl={6}>
                                    <Form.Label>Facility Type<span className="text-danger ms-1">*</span></Form.Label>
                                    <Form.Select aria-label="Default select example" name="facilityType" value={bookingDetails.facilityType} onChange={handleChange}>
                                        {apiResponse.facilityType.map((facility) => {
                                            return (
                                                <option value={facility.title} >{facility.title}</option>
                                            );
                                        })

                                        }
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <Form.Label className="fw-medium ">Booking Occurence</Form.Label>
                                    <div className="mt-2">
                                        <Form.Check
                                            inline
                                            label="Single Booking"
                                            name="bookingOccurence"
                                            type={"radio"}
                                            id={`inline-1`}
                                            checked={bookingDetails.bookingOccurence === "Single Booking" && true}
                                            value={"Single Booking"}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <Form.Check
                                            inline
                                            label="Multiple Booking"
                                            name="bookingOccurence"
                                            type={"radio"}
                                            id={`inline-2`}
                                            value={"Multiple Booking"}
                                            onChange={handleChange}
                                            checked={bookingDetails.bookingOccurence === "Multiple Booking" && true}
                                        />
                                    </div>
                                </Col>
                                {bookingDetails.bookingOccurence === "Multiple Booking" && <Col>
                                    <Form.Label>Frequency</Form.Label>
                                    <Form.Select aria-label="Default select example" name="frequency" value={bookingDetails.frequency} onChange={handleChange}>
                                        <option value={"Weekly"}>Weekly</option>
                                    </Form.Select>
                                </Col>}

                            </Row>
                            <Row className="mt-4">
                                <Col sm={12} md={6} lg={3} xl={3}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label className="mb-0">Start Date<span className="text-danger ms-1">*</span></Form.Label>
                                        {/* <Form.Control type="date" placeholder="Enter email" className="mt-2 " name="startDate"   value={bookingDetails.startDate} max={today} onChange={handleChange}/> */}
                                        <DatePicker className="form-control mt-2" minDate={new Date()} selected={bookingDetails.startDate || ""} onChange={handleDateChange} placeholderText="mm/dd/yyyy" />
                                    </Form.Group>
                                </Col>
                                <Col sm={12} md={6} lg={3} xl={3}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label className="mb-0">End Date<span className="text-danger ms-1">*</span></Form.Label>
                                        <DatePicker className="form-control mt-2" selected={bookingDetails.endDate || ""} onChange={handleDateChange} disabled={bookingDetails.bookingOccurence === "Single Booking"} minDate={bookingDetails.startDate} placeholderText="mm/dd/yyyy" excludeDates={[bookingDetails.startDate]} />
                                    </Form.Group>
                                </Col>
                                <Col sm={12} md={6} lg={3} xl={3}>
                                    <Form.Label className="mb-2">Start Time<span className="text-danger ms-1">*</span></Form.Label>

                                    <Select
                                        value={Time.find(option => option.value === startTime)}

                                        onChange={(selectedOption, actionMeta) => handleReactSelectChange(selectedOption, actionMeta)}
                                        options={Time}
                                        placeholder="hh:mm"
                                        name="startTime"
                                        isDisabled={bookingDetails.startDate === null && bookingDetails.endDate === null}
                                    />

                                </Col>
                                <Col sm={12} md={6} lg={3} xl={3}>
                                    <Form.Label className="mb-2 ">End Time<span className="text-danger ms-1">*</span></Form.Label>
                                    <Select
                                        value={Time.find(option => option.value === endTime)}
                                        onChange={(selectedOption, actionMeta) => handleReactSelectChange(selectedOption, actionMeta)}
                                        options={Time}
                                        placeholder="hh:mm"
                                        name="endTime"
                                        isDisabled={bookingDetails.startDate === null && bookingDetails.endDate === null}
                                    />
                                    {/* <input type="time" className="form-control " id="timePicker" placeholder="hh:mm" /> */}
                                </Col>
                            </Row>
                            <div className="mt-5">
                                <Button variant="danger" className="">Check Availability</Button>
                            </div>
                            <div className="fw-medium">Available Facility</div>
                            <Row >
                                <div className="my-2 fw-medium">Player Details</div>
                                <Row className="mt-2">
                                    <Col  sm={12} lg={6} xl={6}>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter First Name" className="mt-1" name="firstName" value={bookingDetails.firstName} onChange={handleChange} />
                                    </Col>
                                    <Col  sm={12} lg={6} xl={6}>
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Last Name" className="mt-1" name="lastName" value={bookingDetails.lastName} onChange={handleChange} />
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col>
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control type="number" placeholder="Enter Phone Number" className="mt-1" name="phoneNumber" value={bookingDetails.phoneNumber} onChange={handleChange} />
                                    </Col>
                                    <Col>
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Email address" className="mt-1" name="emailAddress" value={bookingDetails.emailAddress} onChange={handleChange} />
                                    </Col>
                                </Row>
                            </Row>
                            <Row className="mt-3 d-flex justify-content-between ">
                                <Col xs={6} className="">
                                    <Form.Label className="px-0 fw-medium">Facility</Form.Label>
                                    <div className="h-35 border p-2">
                                        {Object.values(apiResponse.facilities).map((type: any, index: any) => {
                                            console.log(type[index].name, index, "typein")
                                            return (
                                                <div key={index}>
                                                    {type.map((facility: any) => {
                                                        console.log(facility?.name, "facilityin")
                                                        return (
                                                            <Form.Check
                                                                type={"radio"}
                                                                // id={`${type}`}
                                                                label={`${facility?.name}`}
                                                                onClick={() => handleBookFacility(facility)}
                                                            />)
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Col>
                                <Col xs={6} className="">
                                    <Form.Label className="px-0 fw-medium">Pricing Rule</Form.Label>
                                    <div className="h-35 border p-2">

                                        <div className="fw-medium">{facility}</div>
                                        {Object.values(apiResponse.pricingrule).map((pricing, index) => {
                                            //  console.log(pricing?.pricingRule?.ruleName, "pricein")
                                            return (
                                                <div key={index}>
                                                    <Form.Check
                                                        type={"radio"}
                                                        // id={`${type}`}
                                                        label={`${pricing?.pricingRule?.ruleName}`}
                                                    />
                                                </div>
                                            )
                                        })}

                                    </div>
                                </Col>
                            </Row>
                            <div className="text-end mt-3"><Button variant="success">save</Button></div>
                            <Row className="mt-4 mx-1">
                                <Form.Label className="px-0 fw-medium">Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Leave a comment here"
                                    style={{ height: '100px' }}
                                    name="notes"
                                    value={bookingDetails.notes}
                                    onChange={(e) => handleChange(e)}
                                />

                            </Row>
                        </Col>
                        <Col xs={4} className="border border-2 p-3">
                            <div>Booking Type</div>
                            <div className="fw-bold mt-2">{bookingDetails.bookingType}</div>
                            <hr />
                            <div>Start date and Time</div>
                            {bookingDetails.startDate && <div className="fw-medium"><Moment format="MMMM DD YYYY ">{bookingDetails.startDate}</Moment>{bookingDetails.startTime} </div>}
                            <div>End date and Time</div>
                            {bookingDetails.endDate && <div className="fw-medium"><Moment format="MMMM DD YYYY ">{bookingDetails.endDate}</Moment>{bookingDetails.endTime}</div>}
                            <hr />
                            <div>Facility Type</div>
                            <div className="fw-bold mt-2">{bookingDetails.facilityType}</div>
                            <hr />
                            <div className="fw-bold">Player's Facility and Pricing Details</div>
                        </Col>
                    </Row>
                </Offcanvas.Body>
                <div className="bg-gainsboro text-end p-2">
                    <Button variant="danger" onClick={handleSubmit}>Proceed to Book</Button>
                </div>

            </Offcanvas>
        </div>
    );
}
export default Reservation;


