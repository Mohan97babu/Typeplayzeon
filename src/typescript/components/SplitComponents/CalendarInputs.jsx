import {Row,Col,Button,} from "react-bootstrap"
import Select from "../CommonInputs/Select";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {datas} from "../Context/context";
import { useContext } from "react";

const CalendarInputs = ({handleCalendarChange,handleIds,handleDateCalendar,handleSearchCalendar,handleShow}) => {
    const {calendarDetails,apiResponse,facilityItemIds} = useContext(datas);
  
    return (
        <Row className="p-3 mx-0">
            <div className="d-lg-flex justify-content-between">
                <Col sm={12} md={12} lg={2} xl={3}>
                    <Select SelectTitle={"Facility Type"} Mandatory={<span className="text-danger">*</span>} className={"mt-2"} value={calendarDetails.facilityType} name={"facilityType"} handleChange={(e) => handleCalendarChange(e)}
                        Options={<> {Array.isArray(apiResponse.facilityType) && apiResponse.facilityType.map((facility: any) => {
                            const sportsId = facility.sport.id;
                            return (
                                <option value={facility.title} onClick={(e) => handleCalendarChange(e, sportsId)}>{facility.title}</option>
                            );
                        })}</>} />
                </Col>
                <Col sm={12} md={12} lg={2} xl={3}>
                    <Select SelectTitle={"Facilities"} Mandatory={<span className="text-danger">*</span>} className={"mt-2"} value={calendarDetails.facilityId} onChange={handleIds}
                        Options={<><option value={"All Court"}>All Court</option>
                            {Object.entries(apiResponse.facilities).map(([courtName, courtArray]) => (
                                courtArray.map((facilityItem: { id: any; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }, index: any) => {
                                    facilityItemIds.push(facilityItem.id);
                                    return (
                                        <option key={`${courtName}-${index}`} value={facilityItem.id}> {facilityItem.name}</option>
                                    )
                                })))}</>} />
                </Col>
                <Col sm={12} md={12} lg={2} xl={2} className="mt-1 d-flex flex-column">
                    <label className="mb-2">Date</label>
                    <DatePicker className="form-control  " onChange={(e: any) => handleDateCalendar(e)} selected={calendarDetails.date} minDate={new Date()} showIcon />
                </Col>
                <div className="mt-3">
                        <Col className="mt-3 ">
                            <div className="mt-3 d-flex justify-content-around " >
                                <Button variant="primary" onClick={handleSearchCalendar}> <Icon icon="ic:baseline-search" height={21} />Search </Button>
                                <Button variant="danger" className="ms-4" onClick={handleShow}> Add Booking </Button>
                            </div>
                        </Col>
                    </div>
            </div>
        </Row>
    )
}
export default CalendarInputs