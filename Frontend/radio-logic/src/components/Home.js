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
import Modal from 'react-bootstrap/Modal';
import { FaImages } from 'react-icons/fa';
import { MdMessage } from 'react-icons/md';
import { FiMail } from 'react-icons/fi';
import { FaFolderOpen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { GiStethoscope } from 'react-icons/gi';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { AiOutlineArrowDown } from 'react-icons/ai';
import RadioLogicService from '../services/RadioLogicService';
import { Link } from 'react-router-dom';

class Home extends React.Component {

    userId = null;

    constructor(props) {
        super(props);
        this.userId = sessionStorage.getItem('userId');
        this.state = {
            patients: [], patientsTemp: [], showModal: false, showDelete: false,
            isLoading: true, dropValue: "Order By", isError: false, patientId: '',
            patientName: "", patientDescription: "", patientNameError: "", patientDescriptionError: ""
        };
        this.onSearch = this.onSearch.bind(this);
        this.addPatient = this.addPatient.bind(this);
        this.deletePatient = this.deletePatient.bind(this);
        this.showDeleteModal = this.showDeleteModal.bind(this);
    }

    // This method populates the patient list by making a call to RadioLogicService
    async componentDidMount() {
        // Try sending request to REST API
        try {
            let result = await RadioLogicService.getPatients(this.userId);
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

    // Adds a patient to the database
    async addPatient() {
        if (this.state.patientName.length < 1) {
            this.setState({ patientNameError: "The patient must have a name" });
            return;
        }

        await RadioLogicService.addPatient({ userId: this.userId, name: this.state.patientName, description: this.state.patientDescription });
        window.location.reload();
    }

    async deletePatient() {
        await RadioLogicService.deletePatient(this.state.patientId);
        window.location.reload();
    }

    // Used to display and hide delete modal pop-up
    showDeleteModal(patientId) {this.setState({showDelete: true, patientId: patientId})}
    hideDeleteModal = () => { this.setState({ showDelete: false, patientId: '' }) }

    // Used to display and hide the modal pop-up
    handleClose = () => { this.setState({ showModal: false }); }
    handleShow = () => { this.setState({ showModal: true }); }

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
                    handleShow={this.handleShow}
                />

                <Modal
                    show={this.state.showModal}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add new patient</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Patient name</Form.Label>
                                <Form.Control type="text" onChange={e => this.setState({ patientName: e.target.value })} placeholder="Enter patient name" />
                                <Form.Text className="text-danger">{this.state.patientNameError}</Form.Text>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Patient description</Form.Label>
                                <Form.Control type="text" onChange={e => this.setState({ patientDescription: e.target.value })} placeholder="Enter patient description" />
                                <Form.Text className="text-danger">{this.state.patientDescriptionError}</Form.Text>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                        <Button variant="success" onClick={this.addPatient}>Save</Button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    show={this.state.showDelete}
                    onHide={this.hideDeleteModal}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Patient</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <strong>Warning: </strong>This will remove all images and chats associated with this patient.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.hideDeleteModal}>Cancel</Button>
                        <Button variant="success" onClick={this.deletePatient}>Continue</Button>
                    </Modal.Footer>
                </Modal>

                {this.state.isLoading && <Spinner className="mt-3" animation="border" />}
                {!this.state.isLoading && <PatientList showDeleteModal={this.showDeleteModal} patients={this.state.patients} />}
            </Container>
        );
    }

}

const PatientList = (props) => {
    let patientList = [];

    for (let i = 0; i < props.patients.length; i++) {
        patientList.push(
            <Container style={{ backgroundColor: "rgb(240, 240, 240)" }}>
                <Row className="m-3">
                    <Col sm={2} className="my-auto">
                        <Link style={{ color: 'black' }} to={{ pathname: "/manageimages", patient: props.patients[i] }}><FaImages size={30} /></Link>
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
                        <Link style={{ color: 'black' }} to={{ pathname: "/chats", patient: props.patients[i] }}><MdMessage size={30} /></Link>
                    </Col>
                    <Col sm={1} className="my-auto"><Link onClick={() => {props.showDeleteModal(props.patients[i].patientId)}} style={{ color: 'black' }} ><MdDelete size={30} /></Link></Col>
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
        this.showModal = this.showModal.bind(this);
    }

    // This calls its parent component Home to provide updated list of patients
    search() {
        this.props.onSearch(this.state.searchValue);
    }

    showModal() {
        this.props.handleShow();
    }

    render() {
        return (
            <Navbar style={{ backgroundColor: 'rgb(240, 240, 240)' }} expand="lg" sticky="top">
                <Navbar.Brand><GiStethoscope /> RadioLogic</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={this.showModal}><BsFillPersonPlusFill /> Add new patient</Nav.Link>
                        <NavDropdown title={this.props.dropValue} id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={this.props.onDateAsc}>Date Added <AiOutlineArrowUp /></NavDropdown.Item>
                            <NavDropdown.Item onClick={this.props.onDateDesc}>Date Added <AiOutlineArrowDown /></NavDropdown.Item>
                        </NavDropdown>
                        <Link className='ml-1 my-auto' style={{ color: 'grey', textDecoration: 'none' }} to={{ pathname: "/generalinbox" }} ><FiMail /> General Inbox</Link>
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