import React from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { MdDelete, MdMessage } from 'react-icons/md';
import { GiStethoscope } from 'react-icons/gi';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import RadioLogicService from '../../services/RadioLogicService';


class GeneralInbox extends React.Component {

    userId = null;
    
    constructor(props) {
        super(props);
        this.state = {
            chats: [], chatsTemp: [], dropValue: "Order By",
            isLoading: true, isError: false,
        };
        this.onSearch = this.onSearch.bind(this);
        this.userId = sessionStorage.getItem('userId');
    }

    // This method populates the chat list by making a call to RadioLogicService
    async componentDidMount() {
        // Try sending request to REST API
        try {
            let result = await RadioLogicService.getGeneralChats(this.userId);
            if (result.status === 200) {
                // If all good then render chats on screen
                this.setState({ isLoading: false, chats: result.data, chatsTemp: result.data });
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

    // Order chats from oldest to newest
    onDateAsc = () => {
        this.setState({ dropValue: "Date Ascending", chats: this.state.chatsTemp.sort((a, b) => { return a.dateAdded < b.dateAdded ? -1 : 1 }) });
    }
    // Order chats from newest to oldest
    onDateDesc = () => {
        this.setState({ dropValue: "Date Descending", chats: this.state.chatsTemp.sort((a, b) => { return b.dateAdded < a.dateAdded ? -1 : 1 }) });
    }

    // This gets a list of chats matching the name that the user entered
    onSearch(value) {
        let tempChats = [];
        for (let i = 0; i < this.state.chatsTemp.length; i++) {
            // If the chat's name contains the name entered then add it
            if ((this.state.chatsTemp[i].fname + this.state.chatsTemp[i].lname).toLowerCase().includes(value.toLowerCase())) {
                tempChats.push(this.state.chatsTemp[i]);
            }
        }
        this.setState({ chats: tempChats }); // Render chats matching criteria
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
                {!this.state.isLoading && <ChatList chats={this.state.chats} />}
            </Container>
        );
    }

}

const ChatList = (props) => {
    let chatList = [];

    for (let i = 0; i < props.chats.length; i++) {
        chatList.push(
            <Container className='mx-auto my-2'>
                <Link style={{ color: 'black', textDecoration: 'none' }} to={{ pathname: "/generalmessages", chatId: props.chats[i].chatId }}>
                    <Card>
                        <Card.Title>
                            <Row>
                                <Col className='text-left m-2'>{props.chats[i].fname} {props.chats[i].lname}</Col>
                                <Col className='text-right m-2'>{props.chats[i].dateAdded}</Col>
                            </Row>
                        </Card.Title>
                        <Card.Text className='text-left m-2'>
                            {props.chats[i].text.length < 50 ? props.chats[i].text : props.chats[i].text.substring(0, 50) + "..."}
                        </Card.Text>
                    </Card>
                </Link>
            </Container>
        );
    }

    return chatList;
}

// Top navigation bar which allows users to search and order the collection of chats
class NavTop extends React.Component {

    // Set initial states
    constructor(props) {
        super(props);
        this.state = { searchValue: "" };
        this.search = this.search.bind(this);
    }

    // This calls its parent component ChatScreen to provide updated list of chats
    search() {
        this.props.onSearch(this.state.searchValue);
    }

    render() {
        return (
            <Navbar style={{backgroundColor: 'rgb(240, 240, 240)'}} expand="lg" sticky="top">
                <Link to={{ pathname: '/home' }}><Navbar.Brand><GiStethoscope /> General Inbox</Navbar.Brand></Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown title={this.props.dropValue} id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={this.props.onDateAsc}>Date Added <AiOutlineArrowUp /></NavDropdown.Item>
                            <NavDropdown.Item onClick={this.props.onDateDesc}>Date Added <AiOutlineArrowDown /></NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" onChange={e => this.setState({ searchValue: e.target.value })} placeholder="Enter chat recipient" className="mr-sm-2" />
                        <Button variant="outline-dark" onClick={this.search}>Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default GeneralInbox;