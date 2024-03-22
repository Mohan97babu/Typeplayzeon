import { Icon } from "@iconify/react";
import {Row,Col } from "react-bootstrap";

const EventColors =() =>
{
   return (
    <Row className=" w-100" sm={12} md={10} lg={12} xl={12}>
    <Col sm={12} md={12} lg={9} xl={7} className="d-lg-flex justify-content-lg-between justify-content-md-around" >
        <div ><Icon icon="material-symbols:square" style={{ color: " #fc9403" }} /><span>Player/Not paid</span></div>
        <div> <Icon icon="material-symbols:square" style={{ color: "yellow" }} /><span>Coach</span></div>
        <div>  <Icon icon="material-symbols:square" style={{ color: "purple" }} /><span>Admin</span></div>
        <div>  <Icon icon="material-symbols:square" style={{ color: "grey" }} /><span>Maintenance</span></div>
        <div> <Icon icon="material-symbols:square" style={{ color: "alice" }} /><span>Tournament</span></div>
        <div> <Icon icon="material-symbols:square" style={{ color: "green" }} /><span>Player/Paid</span> </div>
    </Col>
    <Col sm={12} lg={3} xl={5}><div className="fw-medium fs-5 text-lg-end">Booking Schedules</div></Col>
</Row>
   )
}
export default EventColors