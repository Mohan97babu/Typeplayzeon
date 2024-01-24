import React from "react";
import { Nav, Dropdown, Navbar, Container } from "react-bootstrap"
import logo from "../../assets/images/logobgremove.png"

const NavBar: React.FC = () => {
    return (
        <Navbar expand="lg" className="bg-dark">
            <Container fluid>
                <Navbar.Brand href="#home"><img src={logo} width={180} height={50} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                    <Nav >
                        <Nav.Link href="#home" className="text-white fs-4 ms-3">ABC Organization</Nav.Link>

                        {/* <div className=" justify-content-end">
            <NavDropdown title="Dropdown" id="basic-nav-dropdown" >
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
            </div> */}
                    </Nav>
            <div >
                        <Dropdown align="end">
                            <Dropdown.Toggle className="bg-transparent border border-0" id="dropdown-basic">
                                Dropdown Button
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
            </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default NavBar;