import Select from "../CommonInputs/Select.tsx"
import { useContext } from "react"
import { data1 } from "../Context/Context.ts"
import React from "react";
import {Row,Col,Button} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Icon } from "@iconify/react";
import Buttons from "../CommonInputs/Buttons.tsx";


const CalendarInputs = ({ handleCalendarChange,handleDateCalendar,handleSearchCalendar,handleShow }) => {
    const { bookingDetails, apiResponse, calendarDetails,facilityItemIds } = useContext(data1);
    console.log(apiResponse, "apires");
    return (
        <Row className="p-3 mx-0">
            <div className="d-md-flex justify-content-between">
                <Col sm={12} md={2} lg={2} xl={3}>
                    <Select SelectTitle={"Facility Type"} className={"mt-2"} value={calendarDetails.facilityType} name={"facilityType"} handleChange={handleCalendarChange} Options={Array.isArray(apiResponse.facilityType) && apiResponse.facilityType.map((facility: any) => {
                        const sportsId = facility.sport.id;
                        return (
                            <option key={sportsId} value={facility.title}>{facility.title}</option>
                        );
                    })} />
                </Col>
                <Col sm={12} md={2} lg={2} xl={3}>
                    <Select  SelectTitle={"Facilities"} className="mt-2" Options={<><option value={""}>All Court</option>
                            {Object.entries(apiResponse.facilities).map(([courtName, courtArray]) => (
                                courtArray.map((facilityItem: { id: any; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }, index: any) => {
                                    facilityItemIds.push(facilityItem.id);
                                    return (
                                        <option key={`${courtName}-${index}`} value={facilityItem.name}> {facilityItem.name}</option>
                                    )
                                })))}</>}/>
                </Col>
                <Col sm={12} md={2} lg={2} xl={2} className="mt-2 ">
                        <label className="mb-2">Date</label>
                        <DatePicker className="form-control  " onChange={(e: any) => handleDateCalendar(e)} selected={calendarDetails.date} minDate={new Date()} showIcon />
                    </Col>
                    <div className="mt-3">
                        <Col className="mt-3 ">
                            <div className="mt-3  " >
                                <Buttons variant={"primary"} handleClick={handleSearchCalendar} content={"Search"} icon={<Icon icon="ic:baseline-search" height={21} />}/>
                                <Buttons variant={"danger"} className={"ms-4"} handleClick={handleShow} content={"Add Booking"} />
                            </div>
                        </Col>
                    </div>
               </div>
        </Row>
    )
}
export default CalendarInputs