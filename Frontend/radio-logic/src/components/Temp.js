import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Navbar from 'react-bootstrap/Navbar';
import { FaImages } from 'react-icons/fa';
import { MdSlideshow } from 'react-icons/md';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { RiImageAddFill } from 'react-icons/ri';
import { FaLayerGroup } from 'react-icons/fa';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { Link } from 'react-router-dom';

class Temp extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container fluid>
                <NavTop
                    dropValue={"Order By"}
                />

                <Container style={{ backgroundColor: "rgb(240, 240, 240)" }}>
                    <Row className="m-3">
                        <Col sm={2} className="my-auto">
                            <Link style={{ color: 'black' }}><RiImageAddFill size={30} /></Link>
                        </Col>
                        <Col sm={8}>
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="button" eventKey="0">Graphic Design Inspiration</Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>This is where the description for this group would go and would only show up when the group is clicked on.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                        <Col sm={1} className="my-auto">
                            <Link style={{ color: 'black' }}><MdSlideshow size={30} /></Link>
                        </Col>
                        <Col sm={1} className="my-auto"><BsFillGrid3X3GapFill size={30} /></Col>
                    </Row>
                </Container>
                <Container style={{ backgroundColor: "rgb(240, 240, 240)" }}>
                    <Row className="m-3">
                        <Col sm={2} className="my-auto">
                            <Link style={{ color: 'black' }}><RiImageAddFill size={30} /></Link>
                        </Col>
                        <Col sm={8}>
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="button" eventKey="0">Banner Design Inspiration</Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>This is where the description for this group would go and would only show up when the group is clicked on.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                        <Col sm={1} className="my-auto">
                            <Link style={{ color: 'black' }}><MdSlideshow size={30} /></Link>
                        </Col>
                        <Col sm={1} className="my-auto"><BsFillGrid3X3GapFill size={30} /></Col>
                    </Row>
                </Container>

            </Container>
        );
    }

}

// Top navigation bar which allows users to search and order the collection of patients
class NavTop extends React.Component {

    // Set initial states
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Navbar style={{ backgroundColor: 'rgb(240, 240, 240)' }} expand="lg" sticky="top">
                <Navbar.Brand><FaImages /> Photo Categorizer</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link><FaLayerGroup /> Create new group</Nav.Link>
                        <NavDropdown title={this.props.dropValue} id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={this.props.onDateAsc}>Date Added <AiOutlineArrowUp /></NavDropdown.Item>
                            <NavDropdown.Item onClick={this.props.onDateDesc}>Date Added <AiOutlineArrowDown /></NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Enter image/group name" className="mr-sm-2" />
                        <Button variant="outline-dark">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Temp;