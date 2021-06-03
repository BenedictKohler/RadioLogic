import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { RiImageAddFill } from 'react-icons/ri';
import { Redirect } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import RadioLogicService from '../services/RadioLogicService';

// Component for adding a new patient image
class AddImage extends React.Component {

    patient = null;

    // Sets initial states
    constructor(props) {
        super(props);
        this.patient = JSON.parse(sessionStorage.getItem('patient'));
        this.renderImage = this.renderImage.bind(this);
        this.readFile = this.readFile.bind(this);
        this.state = {
            imageName: "", imageNameError: "",
            description: "", descriptionError: "",
            // This is a placeholder picture
            imageURL: "https://deejayfarm.com/wp-content/uploads/2019/10/Profile-pic.jpg",
            imageObj: null, imageError: "",
            redirect: false, isLoading: false
        };
    }

    // This displays the users selected picture and updates the image to be uploaded
    renderImage(val) {
        this.setState({
            imageURL: URL.createObjectURL(val),
            imageObj: val
        });
    }

    // Converts the image to Base64 for easier upload
    readFile(file) {
        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = res => {
                resolve(res.target.result);
            };

            reader.onerror = err => reject(err);

            reader.readAsDataURL(file);
        });
    }

    // This makes sure that the user has entered valid information before posting it
    handleInfo = async () => {
        // Possible errors
        let isError = false;
        let imgNameError, descError, imgError, sError = "";

        // Check for errors
        if (this.state.imageName.length < 1) {
            imgNameError = "This field can't be empty";
            isError = true;
        }
        if (this.state.description.length < 1) {
            descError = "This field can't be empty";
            isError = true;
        }
        if (this.state.imageObj == null) {
            imgError = "An image for the patient is required";
            isError = true;
        }

        // If there's an error display it for user to fix
        if (isError) {
            this.setState({
                imageNameError: imgNameError, descriptionError: descError, imageError: imgError
            });
            // Otherwise, upload info and navigate back to homescreen when done
        } else {

            // Display loading alert
            this.setState({ isLoading: true });

            // Encode the image
            const contents = await this.readFile(this.state.imageObj);

            // Send the information
            RadioLogicService.addImage({
                patientId: this.patient.patientId, name: this.state.imageName, 
                description: this.state.description, imageData: contents
            }).then(() => {
                this.setState({ redirect: true }); // Go to previous page
            });

        }
    }


    render() {
        if (this.state.redirect) return <Redirect to={{ pathname: "/manageimages" }} />
        return (
            <Container>

                <h3 class="mt-3">Add a new image for {this.patient.name}</h3>

                <Form>

                    <Container className="mt-3">
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Image name</Form.Label>
                                    <Form.Control type="text" onChange={e => this.setState({ imageName: e.target.value })} placeholder="Image name" />
                                    <Form.Text className="text-danger">{this.state.imageNameError}</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>

                    <Image src={this.state.imageURL} className="mb-3" width="50%" rounded />

                    <Container>
                        <Form.Group>
                            <Form.File
                                label="Select patient image"
                                custom
                                onChange={e => this.renderImage(e.target.files[0])}
                            />
                            <Form.Text className="text-danger">{this.state.imageError}</Form.Text>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={2} onChange={e => this.setState({ description: e.target.value })} placeholder="Description or notes about the image" />
                            <Form.Text className="text-danger">{this.state.descriptionError}</Form.Text>
                        </Form.Group>
                    </Container>

                    <Container className="mb-3">
                        <Row>
                            <Col>
                                <Button variant="outline-success" onClick={this.handleInfo} type="button"><RiImageAddFill /> Add Image</Button>
                            </Col>
                        </Row>
                    </Container>

                    {this.state.isLoading && <Alert variant="primary">
                        <Alert.Heading>Processing...</Alert.Heading>
                        <p>Please wait to be redirected to the previous screen</p>
                    </Alert>}

                </Form>
            </Container>
        );
    }
}

export default AddImage;