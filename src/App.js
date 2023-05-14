import React, { useContext, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { Container, Navbar, Nav, NavDropdown, Form, Button, Row, InputGroup, Col } from 'react-bootstrap';
import OctoCat from "./resources/github-octocat.svg";
import NotFound from './components/NotFound';
import DetailScreen from './components/DetailScreen';

function App() {
  return (
    <div className="App">
      <NavBar />
      <AppRoutes />
    </div>
  );
}

const AppRoutes = (props) => {
  return <Routes >
    <Route path='/' element={<Home />} />
    <Route path='/searchResults/:searchQuery' element={<DetailScreen />} />
    <Route path='*' element={<NotFound />} />
  </Routes>
}

const NavBar = () => {
  return <Navbar bg="dark" variant='dark' expand="md" sticky="top" >
    <Container>
      <Navbar.Brand href="/">Github Profiler</Navbar.Brand>
      {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link">Link</Nav.Link>
        </Nav>
        <Nav className="me-3">
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
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
        </Nav> 
      </Navbar.Collapse> */}
    </Container>
  </Navbar>
}


const Home = () => {
  const [searchUserQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchUser = (e) => {
    e.preventDefault();

    if (searchUserQuery && searchUserQuery.length > 0) {
      navigate(`/searchResults/${searchUserQuery}`, { state: { searchUserQuery } });
    }
  }

  return <>
    <Container fluid="md" >
      <Row className="paddingY-7">
        <Col className="home-main-content" >
          <img src={OctoCat} alt="Github OctoCat" width={"240px"} />
          <InputGroup size="lg" className="mx-auto my-3" style={{ "width": "80%" }} >
            <Form.Control
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              type="text"
              placeholder="Github Username or email id"
              value={searchUserQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </InputGroup>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSearchUser}
          >
            {'Search Github'}
          </Button>
        </Col>
      </Row>
    </Container>
  </>
}

export default App;
