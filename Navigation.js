
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {LinkContainer} from 'react-router-bootstrap'

function Navigation() {
    return (

        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
        <LinkContainer to="/">
          <Navbar.Brand >Home</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
       
              <LinkContainer to="/about">
              <Nav.Link >About</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/contact">
              <Nav.Link >Contact</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/doginfo">
              <Nav.Link >Dog Info</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/slider">
              <Nav.Link >Slider</Nav.Link>
              </LinkContainer>
           

              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown> */}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}

export default Navigation;