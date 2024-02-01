import { Col, Row, Form, Button, Offcanvas } from "react-bootstrap";
import { Icon } from "@iconify/react";
import React, { useState, ChangeEvent, useEffect } from "react";
import Select from 'react-select';
import { FacilityType, BookingType } from "../../utils/Data";
import { Time } from "../../utils/Data";
import Moment from "react-moment";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Reservation: React.FC = ({ bookingDetails, setBookingDetails }) => {
    const [show, setShow] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSubmit = () => {

        console.log(bookingDetails);
    }
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBookingDetails({ ...bookingDetails, [name]: value });

    }
    useEffect(() => {
        if (bookingDetails.bookingOccurence === "Single Booking") {

            setBookingDetails({ ...bookingDetails, endDate: bookingDetails.startDate });
        }
        console.log(bookingDetails.bookingOccurence, "in");

    }, [bookingDetails.startDate])


    const today = moment().format('L');

    console.log(today, "svd")
    console.log(bookingDetails.endDate, "end")
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
    const handleDateChange = (selectedDate: any) => {

        if (bookingDetails.startDate === "") {

            setBookingDetails({ ...bookingDetails, startDate: selectedDate });
        }
        else {
            setBookingDetails({ ...bookingDetails, endDate: selectedDate })
        }
    };


    return (
        <div className="bg-white mt-2 rounded-2 ">
            <Row className="p-3">
                <Col xs={10} >
                    <Row className=" w-100">
                        <Col>
                            <Icon icon="material-symbols:square" style={{ color: " #fc9403" }} /><span>Player/Not paid</span>
                        </Col>
                        <Col>
                            <Icon icon="material-symbols:square" style={{ color: "yellow" }} /><span>Coach</span>
                        </Col>
                        <Col>
                            <Icon icon="material-symbols:square" style={{ color: "purple" }} /><span>Admin</span>
                        </Col>
                        <Col>
                            <Icon icon="material-symbols:square" style={{ color: "grey" }} /><span>Maintenance</span>
                        </Col>
                        <Col>
                            <Icon icon="material-symbols:square" style={{ color: "alice" }} /><span>Tournament</span>
                        </Col>
                        <Col>
                            <Icon icon="material-symbols:square" style={{ color: "green" }} /><span>Player/Paid</span>
                        </Col>
                    </Row>
                </Col>
                <Col xs={2}>
                    <div className="fw-medium fs-5 text-end">Booking Schedules</div>

                </Col>
            </Row>
            <hr className="my-1" />
            <Row className="p-3">
                <Col xs={4}>
                    <label>Facility Type</label>
                    <Form.Select aria-label="Default select example" className="mt-2">
                        {FacilityType.map((facility) => {
                            return (
                                <option value={facility.value}>{facility.label}</option>
                            );
                        })}
                    </Form.Select>
                </Col>
                <Col xs={3}>
                    <label>Facilities</label>
                    <Form.Select aria-label="Default select example" className="mt-2">
                        <option>Open this select menu</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </Form.Select>
                </Col>


                <Col xs={5} className="d-flex justify-content-evenly align-items-end">
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label className="mb-0">Date</Form.Label>
                        <Form.Control type="date" placeholder="Enter email" className="mt-2 " />
                    </Form.Group>
                    <div >

                        <Button variant="primary"> <Icon icon="ic:baseline-search" height={25} />Search </Button>
                        <Button variant="danger" className="ms-4" onClick={handleShow}>
                            Add Booking
                        </Button>
                    </div>


                </Col>
            </Row>
            <Offcanvas show={show} onHide={handleClose} backdrop="static" placement="end" className="w-75 ">
                <Offcanvas.Header className="bg-gainsboro" closeButton>
                    <Offcanvas.Title >Booking</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body >
                    <Row>
                        <Col xs={8}>
                            <Row>
                                <Col xs={6}>
                                    <Form.Label className="fw-medium">Booking Type<span className="text-danger ms-1">*</span></Form.Label>
                                    <Form.Select aria-label="Default select example" name="bookingType" value={bookingDetails.bookingType} onChange={handleChange}>
                                        {BookingType.map((booking) => {
                                            return (
                                                <option value={booking.value}>{booking.label}</option>
                                            )
                                        })}
                                    </Form.Select>
                                </Col>
                                <Col xs={6}>
                                    <Form.Label>Facility Type<span className="text-danger ms-1">*</span></Form.Label>
                                    <Form.Select aria-label="Default select example" name="facilityType" value={bookingDetails.facilityType} onChange={handleChange}>
                                        {FacilityType.map((facility) => {
                                            return (
                                                <option value={facility.label} >{facility.label}</option>
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
                                            onChange={handleChange}
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
                                <Col >
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label className="mb-0">Start Date<span className="text-danger ms-1">*</span></Form.Label>
                                        {/* <Form.Control type="date" placeholder="Enter email" className="mt-2 " name="startDate"   value={bookingDetails.startDate} max={today} onChange={handleChange}/> */}
                                        <DatePicker className="form-control mt-2" minDate={new Date().toString()} selected={bookingDetails.startDate} onChange={handleDateChange} placeholderText="mm/dd/yyyy" />
                                    </Form.Group>
                                </Col>
                                <Col >
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label className="mb-0">End Date<span className="text-danger ms-1">*</span></Form.Label>
                                        {/* <Form.Control type="date" placeholder="Enter email" className="mt-2 " name="endDate" value={bookingDetails.endDate} onChange={handleChange} disabled={bookingDetails.bookingOccurence ==="Single Booking"}/> */}
                                        <DatePicker className="form-control mt-2" selected={bookingDetails.endDate} onChange={handleDateChange} disabled={bookingDetails.bookingOccurence === "Single Booking"} minDate={bookingDetails.startDate} placeholderText="mm/dd/yyyy" excludeDates={[bookingDetails.startDate]} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Label className="mb-2">Start Time<span className="text-danger ms-1">*</span></Form.Label>
                                    {/* <input type="time" className="form-control" id="timePicker"  placeholder="hh:mm"/> */}
                                    {/* <Form.Control type="time" name="starttime" ></Form.Control> */}
                                    <Select
                                        value={Time.find(option => option.value === startTime)}

                                        onChange={(selectedOption, actionMeta) => handleReactSelectChange(selectedOption, actionMeta)}
                                        options={Time}
                                        placeholder="hh:mm"
                                        name="startTime"
                                        isDisabled={bookingDetails.startDate === "" && bookingDetails.endDate === ""}
                                    />

                                </Col>
                                <Col>
                                    <Form.Label className="mb-2 ">End Time<span className="text-danger ms-1">*</span></Form.Label>
                                    <Select
                                        value={Time.find(option => option.value === endTime)}
                                        onChange={(selectedOption, actionMeta) => handleReactSelectChange(selectedOption, actionMeta)}
                                        options={Time}
                                        placeholder="hh:mm"
                                        name="endTime"
                                        isDisabled={bookingDetails.startDate === "" && bookingDetails.endDate === ""}
                                    />
                                    {/* <input type="time" className="form-control " id="timePicker" placeholder="hh:mm" /> */}
                                </Col>
                            </Row>
                            <div className="mt-5">
                                <Button variant="danger" className="">Check Availability</Button>
                            </div>
                            <div>Available Facility</div>
                            <Row >
                                <div className="my-2">Player Details</div>
                                <Row className="mt-2">
                                    <Col>
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter First Name" className="mt-1" name="firstName" value={bookingDetails.firstName} onChange={handleChange} />
                                    </Col>
                                    <Col>
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
                            <Row className="mt-4 mx-1">
                                <Form.Label className="px-0 fw-medium">Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Leave a comment here"
                                    style={{ height: '100px' }}
                                    name="notes"
                                    value={bookingDetails.notes}
                                    onChange={handleChange}
                                />

                            </Row>
                        </Col>
                        <Col xs={4} className="border border-2 p-3">
                            <div>Booking Type</div>
                            <div className="fw-bold mt-2">{bookingDetails.bookingType}</div>
                            <hr />
                            <div>Start date and Time</div>
                          <div className="fw-medium"><Moment format="MMMM DD YYYY ">{bookingDetails.startDate}</Moment>{bookingDetails.startTime} </div>
                            <div>End date and Time</div>
                           <div className="fw-medium"><Moment format="MMMM DD YYYY ">{bookingDetails.endDate}</Moment>{bookingDetails.endTime}</div> 
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


