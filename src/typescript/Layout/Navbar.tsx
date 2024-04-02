import React from "react";
import { Nav, Navbar, Container,Dropdown  } from "react-bootstrap"
import logo from "../../assets/images/LogoNav.png"
import { Link } from "react-router-dom";

const NavBar: React.FC<{setIsSignedIn :React.Dispatch<React.SetStateAction<boolean>>}> = ({ setIsSignedIn ,orgDetails}) => {
    const handleSignOut = () => {
        setIsSignedIn(false);

    }
 //   console.log(orgDetails,"orgdet")
 const firstName = localStorage.getItem("first");
 const lastName = localStorage.getItem("last");
 const orgName = localStorage.getItem("orgName");
    return (
        <Navbar expand="lg" className="bg-dark sticky-top ">
            <Container fluid>
                <Navbar.Brand><img src={logo} width={205} height={55} alt="..." /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-white" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                    <Nav >
                        <Nav.Link className="text-white fs-4 ms-3">{orgName}</Nav.Link>


                    </Nav>

                    <Dropdown>
                        <Dropdown.Toggle className="bg-transparent border-0" id="dropdown-basic">
                           {firstName} {lastName}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>

                            <Dropdown.Item href="#/action-2">Organisation Info</Dropdown.Item>
                            <Link to={"/"} className="text-decoration-none"><Dropdown.Item href="#/action-3" onClick={handleSignOut}>Log out</Dropdown.Item></Link>
                        </Dropdown.Menu>
                    </Dropdown>
                  

                    
                    

                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default NavBar;