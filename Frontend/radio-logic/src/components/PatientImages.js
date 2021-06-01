import React from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { RiImageAddFill } from 'react-icons/ri';
import { MdDelete } from 'react-icons/md';
import { GiStethoscope } from 'react-icons/gi';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { AiOutlineArrowDown } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import RadioLogicService from '../services/RadioLogicService';

class PatientImages extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            images: [], imagesTemp: [], dropValue: "Order By",
            isLoading: true, isError: false,
        };
        this.onSearch = this.onSearch.bind(this);
    }

    // This method populates the image list by making a call to RadioLogicService
    async componentDidMount() {
        // Try sending request to REST API
        try {
            let result = await RadioLogicService.getImages(this.props.location.patient.patientId);
            if (result.status === 200) {
                // If all good then render images on screen
                this.setState({ isLoading: false, images: result.data, imagesTemp: result.data });
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

    // Order images from oldest to newest
    onDateAsc = () => {
        this.setState({ dropValue: "Date Ascending", images: this.state.imagesTemp.sort((a, b) => { return a.dateAdded < b.dateAdded ? -1 : 1 }) });
    }
    // Order images from newest to oldest
    onDateDesc = () => {
        this.setState({ dropValue: "Date Descending", images: this.state.imagesTemp.sort((a, b) => { return b.dateAdded < a.dateAdded ? -1 : 1 }) });
    }

    // This gets a list of images matching the name that the user entered
    onSearch(value) {
        let tempImages = [];
        for (let i = 0; i < this.state.imagesTemp.length; i++) {
            // If the image's name contains the name entered then add it
            if (this.state.imagesTemp[i].name.toLowerCase().includes(value.toLowerCase())) {
                tempImages.push(this.state.imagesTemp[i]);
            }
        }
        this.setState({ images: tempImages }); // Render imagess matching criteria
    }

    render() {
        return (
            <Container fluid>
                <NavTop
                    dropValue={this.state.dropValue}
                    onDateAsc={this.onDateAsc}
                    onDateDesc={this.onDateDesc}
                    onSearch={this.onSearch}
                    patient={this.props.location.patient}
                />
                {this.state.isLoading && <Spinner className="mt-3" animation="border" />}
                {!this.state.isLoading && <ImageList images={this.state.images} />}
            </Container>
        );
    }

}

const ImageList = (props) => {
    let imageList = [];

    for (let i = 0; i < props.images.length; i++) {
        imageList.push(
            <Container style={{width: '50%'}}>
            <Card className="m-2">
                <Card.Header>{props.images[i].name}</Card.Header>
                <Card.Body>
                    <Card.Img src={props.images[i].imageData} />
                </Card.Body>
                <Card.Text className="mt-2 mx-2"><strong>Description:</strong> {props.images[i].description}</Card.Text>
                <Card.Footer>Date Added: {new Date(props.images[i].dateAdded).toUTCString()}</Card.Footer>
            </Card>
            </Container>
        );
    }

    return imageList;
}

// Top navigation bar which allows users to search and order the collection of images
class NavTop extends React.Component {

    // Set initial states
    constructor(props) {
        super(props);
        this.state = { searchValue: "" };
        this.search = this.search.bind(this);
    }

    // This calls its parent component Home to provide updated list of images
    search() {
        this.props.onSearch(this.state.searchValue);
    }

    render() {
        return (
            <Navbar style={{backgroundColor: 'rgb(240, 240, 240)'}} expand="lg" sticky="top">
                <Navbar.Brand><GiStethoscope /> {this.props.patient.name}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link><Link style={{ textDecoration: 'none', color: 'grey' }} to={{ pathname: "/addimage", patient: this.props.patient }}><RiImageAddFill /> Add new image</Link></Nav.Link>
                        <NavDropdown title={this.props.dropValue} id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={this.props.onDateAsc}>Date Added <AiOutlineArrowUp /></NavDropdown.Item>
                            <NavDropdown.Item onClick={this.props.onDateDesc}>Date Added <AiOutlineArrowDown /></NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" onChange={e => this.setState({ searchValue: e.target.value })} placeholder="Enter image name" className="mr-sm-2" />
                        <Button variant="outline-dark" onClick={this.search}>Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default PatientImages;