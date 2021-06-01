import React from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
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
import { MdMessage } from 'react-icons/md';
import { FaFolderOpen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { GiStethoscope } from 'react-icons/gi';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { AiOutlineArrowDown } from 'react-icons/ai';
import RadioLogicService from '../services/RadioLogicService';
import { Link } from 'react-router-dom';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            patients: [], patientsTemp: [],
            isLoading: true, dropValue: "Order By", isError: false,
        };
        this.onSearch = this.onSearch.bind(this);
    }

    // This method populates the patient list by making a call to RadioLogicService
    async componentDidMount() {
        // Try sending request to REST API
        try {
            let result = await RadioLogicService.getPatients(this.props.location.user.data[0].userId);
            if (result.status === 200) {
                // If all good then render patients on screen
                this.setState({ isLoading: false, patients: result.data, patientsTemp: result.data });
            } else {
                // Otherwise display an error message
                this.setState({ isLoading: false, isError: true });
            }
            // If the app is unable to connect to the REST API
        } catch (err) {
            console.log(err);
            this.setState({ isLoading: false, isError: true });
        }
    }

    // Order patients from oldest to newest
    onDateAsc = () => {
        this.setState({ dropValue: "Date Ascending", patients: this.state.patientsTemp.sort((a, b) => { return a.dateAdded < b.dateAdded ? -1 : 1 }) });
    }
    // Order patients from newest to oldest
    onDateDesc = () => {
        this.setState({ dropValue: "Date Descending", patients: this.state.patientsTemp.sort((a, b) => { return b.dateAdded < a.dateAdded ? -1 : 1 }) });
    }

    // This gets a list of patients matching the name that the user entered
    onSearch(value) {
        let tempPatients = [];
        for (let i = 0; i < this.state.patientsTemp.length; i++) {
            // If the patient's name contains the name entered then add it
            if (this.state.patientsTemp[i].name.toLowerCase().includes(value.toLowerCase())) {
                tempPatients.push(this.state.patientsTemp[i]);
            }
        }
        this.setState({ patients: tempPatients }); // Render patients matching criteria
    }

    render() {
        return (
            <Container fluid>
                <NavTop
                    dropValue={this.state.dropValue}
                    onDateAsc={this.onDateAsc}
                    onDateDesc={this.onDateDesc}
                    onSearch={this.onSearch}
                />
                {this.state.isLoading && <Spinner className="mt-3" animation="border" />}
                {!this.state.isLoading && <PatientList patients={this.state.patients} />}
            </Container>
        );
    }

}

const PatientList = (props) => {
    let patientList = [];

    for (let i = 0; i < props.patients.length; i++) {
        patientList.push(
            <Container style={{backgroundColor: "rgb(240, 240, 240)"}}>
            <Row className="m-3">
                <Col sm={2} className="my-auto">
                    <Link style={{color: 'black'}} to={{ pathname: "/manageimages", patient: props.patients[i]}}><FaImages size={30} /></Link>
                </Col>
                <Col sm={8}>
                    <Accordion>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="button" eventKey="0">{props.patients[i].name}</Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>Description:<p>{props.patients[i].description}</p></Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Col>
                <Col sm={1} className="my-auto">
                    <Link style={{color: 'black'}} to={{ pathname: "/chats", patient: props.patients[i]}}><MdMessage size={30} /></Link>
                </Col>
                <Col sm={1} className="my-auto"><MdDelete size={30} /></Col>
            </Row>
            </Container>
        );
    }

    return patientList;
}

// Top navigation bar which allows users to search and order the collection of patients
class NavTop extends React.Component {

    // Set initial states
    constructor(props) {
        super(props);
        this.state = { searchValue: "" };
        this.search = this.search.bind(this);
    }

    // This calls its parent component Home to provide updated list of patients
    search() {
        this.props.onSearch(this.state.searchValue);
    }

    render() {
        return (
            <Navbar style={{backgroundColor: 'rgb(240, 240, 240)'}} expand="lg" sticky="top">
                <Navbar.Brand><GiStethoscope /> RadioLogic</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onSelect={this.props.addPatient}><BsFillPersonPlusFill /> Add new patient</Nav.Link>
                        <NavDropdown title={this.props.dropValue} id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={this.props.onDateAsc}>Date Added <AiOutlineArrowUp /></NavDropdown.Item>
                            <NavDropdown.Item onClick={this.props.onDateDesc}>Date Added <AiOutlineArrowDown /></NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" onChange={e => this.setState({ searchValue: e.target.value })} placeholder="Enter patient name" className="mr-sm-2" />
                        <Button variant="outline-dark" onClick={this.search}>Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default Home;