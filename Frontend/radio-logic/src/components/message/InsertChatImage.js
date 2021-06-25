import React from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { GiStethoscope } from 'react-icons/gi';
import { RiImageAddFill } from 'react-icons/ri';
import { Redirect, Link } from 'react-router-dom';
import RadioLogicService from '../../services/RadioLogicService';

class InsertChatImage extends React.Component {

    chatId = null;
    userId = null;
    patientId = null;

    constructor(props) {
        super(props);
        this.state = {
            images: [], tempImages: [], dropValue: "Order By",
            isLoading: true, isError: false, redirect: false
        };
        this.onSearch = this.onSearch.bind(this);
        this.insertImage = this.insertImage.bind(this);
        this.loadAllImages = this.loadAllImages.bind(this);
        this.chatId = sessionStorage.getItem('chatId');
        this.patientId = sessionStorage.getItem('patientId');
        this.userId = sessionStorage.getItem('userId');
    }

    // This method populates the image list by making a call to RadioLogicService
    async componentDidMount() {
        // Try sending request to REST API
        try {
            let result = await RadioLogicService.getImages(this.patientId);
            if (result.status === 200) {
                // If all good then render images on screen
                this.setState({ isLoading: false, images: result.data, tempImages: result.data });
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

    async insertImage(image) {

        try {
            await RadioLogicService.addImageAddress({
                patientId: this.patientId, name: image.name,
                description: image.description, imageData: image.imageData
            });
            await RadioLogicService.updateChatImage({imageId: image.imageId, chatId: this.chatId});
            this.setState({redirect: true});
        } catch (err) {
            console.log(err);
            this.setState({ isError: true });
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

    // This gets a list of contacts matching the name that the user entered
    onSearch(value) {
        let imagesTemp = [];
        for (let i = 0; i < this.state.tempImages.length; i++) {
            // If the contact's name contains the name entered then add it
            if (this.state.tempImages[i].name.toLowerCase().includes(value.toLowerCase())) {
                imagesTemp.push(this.state.tempImages[i]);
            }
        }
        this.setState({ images: imagesTemp }); // Render contacts matching criteria
    }

    // Loads the full list of images belonging to the current user
    async loadAllImages() {
        return;
        try {
            let result = await RadioLogicService.getImages(this.userId);
            if (result.status === 200) {
                // If all good then render images on screen
                this.setState({ isLoading: false, images: result.data, tempImages: result.data });
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

    render() {
        return (
            <Container fluid>
                <NavTop
                    dropValue={this.state.dropValue}
                    onDateAsc={this.onDateAsc}
                    onDateDesc={this.onDateDesc}
                    onSearch={this.onSearch}
                    loadAllImages={this.loadAllImages}
                />

                {this.state.redirect && <Redirect to={{ pathname: "/messages" }} />}
                {this.state.isLoading && <Spinner className="mt-3" animation="border" />}
                {!this.state.isLoading && <ImageList insertImage={this.insertImage} images={this.state.images} />}
            </Container>
        );
    }

}

const ImageList = (props) => {
    let imageList = [];

    for (let i = 0; i < props.images.length; i++) {
        imageList.push(
            <Container style={{ width: '50%' }}>
                <Card className="m-2">
                    <Card.Header>{props.images[i].name}</Card.Header>
                    <Card.Body>
                        <Card.Img src={props.images[i].imageData} />
                    </Card.Body>
                    <Card.Text className="mt-2 mx-2"><strong>Description:</strong> {props.images[i].description}</Card.Text>
                    <Card.Footer>
                        <Button onClick={() => { props.insertImage(props.images[i]) }} variant="outline-success" className='float-left'>Select Image</Button>
                        <p className='float-right'>Date Added: {new Date(props.images[i].dateAdded).toUTCString()}</p>
                    </Card.Footer>
                </Card>
            </Container>
        );
    }

    return imageList;
}


// Top navigation bar which allows users to search and order the collection of chats
class NavTop extends React.Component {

    // Set initial states
    constructor(props) {
        super(props);
        this.state = { searchValue: "" };
        this.search = this.search.bind(this);
        this.allImages = this.allImages.bind(this);
    }

    // This calls its parent component ChatScreen to provide updated list of chats
    search() {
        this.props.onSearch(this.state.searchValue);
    }

    allImages() {
        this.props.loadAllImages();
    }

    render() {
        return (
            <Navbar style={{ backgroundColor: 'rgb(240, 240, 240)' }} expand="lg" sticky="top">
                <Link to={{ pathname: '/home' }}><Navbar.Brand><GiStethoscope /> Images</Navbar.Brand></Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={this.allImages}><RiImageAddFill /> View all images</Nav.Link>
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

export default InsertChatImage;