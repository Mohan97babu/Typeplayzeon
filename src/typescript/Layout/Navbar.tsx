import React from "react";
import { Nav, Navbar, Container, DropdownButton,Dropdown ,ButtonGroup } from "react-bootstrap"
import logo from "../../assets/images/logobgremove.png"
import { Link } from "react-router-dom";

const NavBar: React.FC<{setIsSignedIn :Boolean}> = ({ setIsSignedIn }) => {
    const handleSignOut = () => {
        setIsSignedIn(false);

    }
    return (
        <Navbar expand="lg" className="bg-dark">
            <Container fluid>
                <Navbar.Brand href="#home"><img src={logo} width={245} height={55} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                    <Nav >
                        <Nav.Link className="text-white fs-4 ms-3">ABC Organization</Nav.Link>


                    </Nav>

                    <Dropdown >
                        <Dropdown.Toggle className="bg-transparent border-0" id="dropdown-basic">
                            Mohan Babu
                        </Dropdown.Toggle>

                        <Dropdown.Menu>

                            <Dropdown.Item href="#/action-2">Organisation Info</Dropdown.Item>
                            <Link to={"/"}><Dropdown.Item href="#/action-3" onClick={handleSignOut}>Log out</Dropdown.Item></Link>
                        </Dropdown.Menu>
                    </Dropdown>
                  

                    
                    

                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default NavBar;