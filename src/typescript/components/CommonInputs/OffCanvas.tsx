import {Offcanvas} from "react-bootstrap"

const OffCanvas =({show,handleClose,canvasClassName,headerClassName,title,closeButton}) =>
{
  <Offcanvas show={show} onHide={handleClose} backdrop ="static" placement="end" className={canvasClassName}>
    <Offcanvas.Header className={headerClassName} >
        <Offcanvas.Title>{title}</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
    </Offcanvas.Body>
  </Offcanvas>


}
export default OffCanvas