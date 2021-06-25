import React from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FiUserPlus } from 'react-icons/fi';
import { GiStethoscope } from 'react-icons/gi';
import { Link, Redirect } from 'react-router-dom';
import RadioLogicService from '../services/RadioLogicService';

class CreateChat extends React.Component {

    patientId = null;
    userId = null;
    chatId = null;

    constructor(props) {
        super(props);
        if (this.props.location.patientId != null) sessionStorage.setItem('patientId', this.props.location.patientId);
        this.state = {
            contacts: [], tempContacts: [], contactId: '', contactIdError: '',
            isLoading: true, isError: false, redirect: false, showModal: false
        };
        this.onSearch = this.onSearch.bind(this);
        this.createChat = this.createChat.bind(this);
        this.addContact = this.addContact.bind(this);
        this.patientId = sessionStorage.getItem('patientId');
        this.userId = sessionStorage.getItem('userId');
    }

    async createChat(contactId) {
        this.chatId = await RadioLogicService.addChat({ userId: this.userId, contactId: contactId, patientId: this.patientId });
        this.setState({ redirect: true });
    }

    // This method populates the chat list by making a call to RadioLogicService
    async componentDidMount() {
        // Try sending request to REST API
        try {
            let result = await RadioLogicService.getContacts(this.userId);
            if (result.status === 200) {
                // If all good then render chats on screen
                this.setState({ isLoading: false, contacts: result.data, tempContacts: result.data });
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

    // Adds a contact to the database if they entered a valid userId
    async addContact() {
        if (this.state.contactId.length < 1) {
            this.setState({ contactIdError: "You must enter an id" });
            return;
        }

        try {
            let user = await RadioLogicService.getUser(this.state.contactId);
            if (user.data.length === 0) {
                this.setState({contactIdError: "Please enter a valid userId"});
                return;
            }
        }
        catch (err) {
            console.log(err.message);
        }

        await RadioLogicService.addContact({ userId: this.userId, contactId: this.state.contactId });
        window.location.reload();
    }

    // Used to display and hide the modal pop-up
    handleClose = () => { this.setState({ showModal: false }); }
    handleShow = () => { this.setState({ showModal: true }); }

    // This gets a list of contacts matching the name that the user entered
    onSearch(value) {
        let contactsTemp = [];
        for (let i = 0; i < this.state.tempContacts.length; i++) {
            // If the contact's name contains the name entered then add it
            if ((this.state.tempContacts[i].fname + this.state.tempContacts[i].lname).toLowerCase().includes(value.toLowerCase())) {
                contactsTemp.push(this.state.tempContacts[i]);
            }
        }
        this.setState({ contacts: contactsTemp }); // Render contacts matching criteria
    }

    render() {
        return (
            <Container fluid>
                <NavTop
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
                        <Modal.Title>Add new contact</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Contact userId</Form.Label>
                                <Form.Control type="text" onChange={e => this.setState({ contactId: e.target.value })} placeholder="Enter the person's userId" />
                                <Form.Text className="text-danger">{this.state.contactIdError}</Form.Text>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.handleClose}>Cancel</Button>
                        <Button variant="success" onClick={this.addContact}>Save</Button>
                    </Modal.Footer>
                </Modal>

                {this.state.redirect && <Redirect to={{ pathname: "/messages", chatId: this.chatId }} />}
                {this.state.isLoading && <Spinner className="mt-3" animation="border" />}
                {!this.state.isLoading && <ContactList createChat={this.createChat} contacts={this.state.contacts} />}
            </Container>
        );
    }

}

const ContactList = (props) => {

    let contactList = [];

    for (let i = 0; i < props.contacts.length; i++) {
        contactList.push(
            <Container className='mx-auto my-2'>
                <Link style={{ textDecoration: 'none', color: 'black' }}>
                    <Card onClick={() => { props.createChat(props.contacts[i].contactId) }}>
                        <Card.Title>
                            <Row>
                                <Col className='text-left m-2'>{props.contacts[i].fname} {props.contacts[i].lname}</Col>
                                <Col className='text-right m-2'>{props.contacts[i].contactId}</Col>
                            </Row>
                        </Card.Title>
                    </Card>
                </Link>
            </Container>
        );
    }

    return contactList;
}

// Top navigation bar which allows users to search and order the collection of chats
class NavTop extends React.Component {

    // Set initial states
    constructor(props) {
        super(props);
        this.state = { searchValue: "" };
        this.search = this.search.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    // This calls its parent component ChatScreen to provide updated list of chats
    search() {
        this.props.onSearch(this.state.searchValue);
    }

    showModal() {
        this.props.handleShow();
    }

    render() {
        return (
            <Navbar style={{ backgroundColor: 'rgb(240, 240, 240)' }} expand="lg" sticky="top">
                <Link to={{ pathname: '/home' }}><Navbar.Brand><GiStethoscope /> Contacts</Navbar.Brand></Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link><Link onClick={this.showModal} style={{ textDecoration: 'none', color: 'grey' }}><FiUserPlus /> Create new contact</Link></Nav.Link>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" onChange={e => this.setState({ searchValue: e.target.value })} placeholder="Enter contact name" className="mr-sm-2" />
                        <Button variant="outline-dark" onClick={this.search}>Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default CreateChat;