import React from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import { BsPencil } from 'react-icons/bs';
import Form from 'react-bootstrap/Form';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import { RiImageAddFill } from 'react-icons/ri';
import { GiStethoscope } from 'react-icons/gi';
import Navbar from 'react-bootstrap/Navbar';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import RadioLogicService from '../../services/RadioLogicService';

class Message extends React.Component {

    undoStack = [];
    redoStack = [];

    isDrawing = false;
    line = [];
    prevPos = { offsetX: 0, offsetY: 0 };

    constructor(props) {
        super(props);
        this.state = {
            messages: [], isLoading: true, isError: false, penColor: 'Blue'
        };
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.endPaintEvent = this.endPaintEvent.bind(this);
        this.saveImage = this.saveImage.bind(this);
        this.undoChange = this.undoChange.bind(this);
        this.redoChange = this.redoChange.bind(this);
    }

    // This method populates the message list by making a call to RadioLogicService
    async componentDidMount() {

        /*var img = document.getElementById("patientImage");
        img.crossOrigin = "anonymous";
        this.canvas.width = img.naturalWidth > 600 ? 600 : img.naturalWidth;
        this.canvas.height = img.naturalHeight > 600 ? 600 : img.naturalHeight;*/

        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5;
        //this.ctx.drawImage(img, 0, 0);
        //img.src = 'http://localhost:8000/1622202975502.jpg';

        // Try sending request to REST API
        try {
            let result = await RadioLogicService.getMessages(this.props.location.chat.chatId);
            if (result.status === 200) {
                // If all good then render messages on screen
                this.setState({ isLoading: false, messages: result.data });
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

    onMouseDown({ nativeEvent }) {
        const { offsetX, offsetY } = nativeEvent;
        this.isDrawing = true;
        this.prevPos = { offsetX, offsetY };
    }

    onMouseMove({ nativeEvent }) {
        if (this.isDrawing) {
            const { offsetX, offsetY } = nativeEvent;
            const offSetData = { offsetX, offsetY };
            // Set the start and stop position of the paint event.
            const positionData = {
                start: { ...this.prevPos },
                stop: { ...offSetData },
            };
            // Add the position to the line array
            this.line = this.line.concat(positionData);
            this.draw(this.prevPos, offSetData, this.state.penColor);
        }
    }

    endPaintEvent() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.line = [];
            // This is were you should update the stack values
        }
    }

    draw(prevPos, currPos, penColor) {
        const { offsetX, offsetY } = currPos;
        const { offsetX: x, offsetY: y } = prevPos;

        this.ctx.beginPath();
        this.ctx.strokeStyle = penColor;
        // Move the the prevPosition of the mouse
        this.ctx.moveTo(x, y);
        // Draw a line to the current position of the mouse
        this.ctx.lineTo(offsetX, offsetY);
        // Visualize the line using the strokeStyle
        this.ctx.stroke();
        this.prevPos = { offsetX, offsetY };
    }

    saveImage() {
    }

    undoChange() {
    }

    redoChange() {
    }

    render() {
        return (
            <Container fluid>

                <Navbar style={{ backgroundColor: 'rgb(240, 240, 240)' }} expand="lg" fixed="top">
                    <Navbar.Brand><GiStethoscope /> Dylan Smith</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link><Link style={{ textDecoration: 'none', color: 'grey' }} to={{ pathname: "/insertImage"}}><RiImageAddFill /> Insert new image</Link></Nav.Link>
                            <BsPencil className='my-auto ml-3' />
                            <NavDropdown title={this.state.penColor} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => { this.setState({ penColor: 'Red'}) }}>Red</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { this.setState({ penColor: 'Blue'}) }}>Blue</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Row className='sticky-top mb-2'>
                    <Col>
                        <canvas
                            ref={(ref) => (this.canvas = ref)}
                            style={{ background: 'black' }}
                            onMouseDown={this.onMouseDown}
                            onMouseLeave={this.endPaintEvent}
                            onMouseUp={this.endPaintEvent}
                            onMouseMove={this.onMouseMove}
                            width="500" height="500"
                        />
                    </Col>
                </Row>

                <Row className='mb-5'>
                    <Col>
                        {this.state.isLoading && <Spinner className="mt-3" animation="border" />}
                        {!this.state.isLoading && <MessageList userId={this.props.location.chat.userId} messages={this.state.messages} />}
                    </Col>
                </Row>

                <Row className='fixed-bottom mx-3'>
                    <Col sm={8}>
                        <Form>
                            <Form.Group>
                                <Form.Control as="textarea" rows='1' type="text" onChange={e => this.setState({ textMessage: e.target.value })} placeholder="Enter message" />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col sm={4}>
                        <Button className='btn btn-block' variant="outline-success" onClick={this.onSend} type="button">Send</Button>
                    </Col>

                </Row>

            </Container>
        );
    }

}

const MessageList = (props) => {
    let messageList = [];

    for (let i = 0; i < props.messages.length; i++) {
        if (props.userId == props.messages[i].senderId) {
            messageList.push(
                <Container className='float-left'>
                    <Alert variant='primary'>{props.messages[i].text}</Alert>
                </Container>
            );
        } else {
            messageList.push(
                <Container className='float-right'>
                    <Alert variant='success'>{props.messages[i].text}</Alert>
                </Container>
            );
        }

    }

    return messageList;
}

export default Message;