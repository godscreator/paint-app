import "./App.css";
import React from "react";
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/Navdropdown'
import Nav from 'react-bootstrap/Nav'
import Container from "react-bootstrap/Container"
import "bootstrap/dist/css/bootstrap.min.css";
import Whiteboard from "./whiteboard.js";


export default function App() {

  return (
    <div className="App">
        
        <div id="topbar">
        <Navbar expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">White Board</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <NavDropdown title="File" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#New">New</NavDropdown.Item>
                  <NavDropdown.Item href="#Open">Open</NavDropdown.Item>
                  <NavDropdown.Item href="#Save">Save</NavDropdown.Item>
                  <NavDropdown.Item href="#Save As">Save As</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#close">Close</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        </div>

        <div id="whiteboard">
          <Whiteboard />
        </div>
    </div>
  );
}
