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
import { BsSquareFill } from 'react-icons/bs';
import { AiOutlineLine } from 'react-icons/ai';
import { BiRectangle } from 'react-icons/bi';
import { RiCheckboxBlankCircleLine } from 'react-icons/ri';
import { GrUndo } from 'react-icons/gr';
import { GrRedo } from 'react-icons/gr';
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
    lastPos = { offsetX: 0, offsetY: 0 };

    chatId = null;
    userId = null;
    image = null;

    constructor(props) {
        super(props);
        if (this.props.location.chatId != null) sessionStorage.setItem('chatId', this.props.location.chatId);
        this.state = {
            messages: [], isLoading: true, isError: false, penColor: 'Black', 
            penWidth: 'Fine', info: {}, textMessage: '', shape: 'Draw Shape', drawingShape: false
        };
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.endPaintEvent = this.endPaintEvent.bind(this);
        this.saveImage = this.saveImage.bind(this);
        this.sendImage = this.sendImage.bind(this);
        this.undoChange = this.undoChange.bind(this);
        this.redoChange = this.redoChange.bind(this);
        this.renderCanvasImage = this.renderCanvasImage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.chatId = sessionStorage.getItem('chatId');
        this.userId = sessionStorage.getItem('userId');
    }

    // This method populates the message list by making a call to RadioLogicService
    async componentDidMount() {

        // Try sending request to REST API
        try {
            let result = await RadioLogicService.getMessages(this.chatId);
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

        // Try sending request to REST API
        try {
            let result = await RadioLogicService.getMessageInfo(this.chatId);
            if (result.status === 200) {
                // If all good then set chat object
                this.setState({ isLoading: false, info: result.data[0] });
            } else {
                // Otherwise display an error message
                this.setState({ isLoading: false, isError: true });
            }
            // If the app is unable to connect to the REST API
        } catch (err) {
            console.log(err);
            this.setState({ isLoading: false, isError: true });
        }

        if (this.state.info.imageId != null) {

            this.image = new Image();
            this.image.crossOrigin = 'anonymous';
            this.image.src = this.state.info.imageData;
            this.image.onload = this.renderCanvasImage;

        }

    }

    onMouseDown({ nativeEvent }) {
        const { offsetX, offsetY } = nativeEvent;
        this.prevPos = { offsetX, offsetY };
        if (this.state.drawingShape) return;
        this.isDrawing = true;
    }

    onMouseMove({ nativeEvent }) {
        if (this.state.drawingShape) {
            const { offsetX, offsetY } = nativeEvent;
            this.lastPos = { offsetX, offsetY };
            return;
        }
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
            var width;
            if (this.state.penWidth == 'Fine') width = 2;
            else if (this.state.penWidth == 'Regular') width = 5;
            else width = 10;
            this.ctx.lineWidth = width;
            this.draw(this.prevPos, offSetData, this.state.penColor);
        }
    }

    endPaintEvent() {
        if (this.state.drawingShape) {
            if (this.state.shape == 'Rectangle') {
                this.ctx.fillStyle = this.state.penColor;
                this.ctx.fillRect(Math.min(this.prevPos.offsetX, this.lastPos.offsetX), Math.min(this.prevPos.offsetY, this.lastPos.offsetY),
                Math.abs(this.prevPos.offsetX - this.lastPos.offsetX), Math.abs(this.prevPos.offsetY - this.lastPos.offsetY));
            }
            else if (this.state.shape == 'Circle') {
                this.ctx.fillStyle = this.state.penColor;
                this.ctx.beginPath();
                this.ctx.arc(this.prevPos.offsetX, this.prevPos.offsetY, Math.abs(this.prevPos.offsetX - this.lastPos.offsetX), 0, 2 * Math.PI);
                this.ctx.fill();
            }
            else if (this.state.shape == 'Line') {
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.state.penColor;
                var width;
                if (this.state.penWidth == 'Fine') width = 2;
                else if (this.state.penWidth == 'Regular') width = 5;
                else width = 10;
                this.ctx.lineWidth = width;
                this.ctx.moveTo(this.prevPos.offsetX, this.prevPos.offsetY);
                this.ctx.lineTo(this.lastPos.offsetX, this.lastPos.offsetY);
                this.ctx.stroke();
            }
            this.setState({drawingShape: false, shape: 'Draw Shape'});
            this.undoStack.push(this.canvas.toDataURL());
            this.redoStack = [];
        }
        if (this.isDrawing) {
            this.isDrawing = false;
            this.line = [];
            this.undoStack.push(this.canvas.toDataURL());
            this.redoStack = [];
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

    sendMessage() {
        RadioLogicService.addMessage({chatId: this.chatId, senderId: this.userId, receiverId: this.state.info.contactId, text: this.state.textMessage});
        window.location.reload();
    }

    saveImage() {
        if (this.undoStack.length == 0) return;
        let imgData = this.undoStack.pop();
        this.undoStack.push(imgData);
        RadioLogicService.addImage({
            patientId: this.state.info.patientId, name: this.state.info.name + " Copy",
            description: this.state.info.description, imageData: imgData
        });
    }

    sendImage() {
        if (this.undoStack.length == 0) return;
        let imgData = this.undoStack.pop();
        this.state.info.imageData = imgData;
        this.undoStack.push(imgData);
        RadioLogicService.updateImage({imageId: this.state.info.imageId, patientId: this.state.info.patientId, name: this.state.info.name, description: this.state.info.description, imageData: this.state.info.imageData});
    }

    renderCanvasImage() {
        var newWidth = this.image.naturalWidth;
        var newHeight = this.image.naturalHeight;

        if (newWidth > newHeight) {
            while (newWidth > 600) {
                newWidth *= 0.95;
                newHeight *= 0.95;
            }
        } else {
            while (newHeight > 500) {
                newWidth *= 0.95;
                newHeight *= 0.95;
            }
        }

        this.canvas.width = newWidth;
        this.canvas.height = newHeight;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
        this.ctx.drawImage(this.image, 0, 0);
    }

    undoChange() {
        if (this.undoStack.length == 0) {
            return;
        }

        else if (this.undoStack.length == 1) {
            this.image.src = this.state.info.imageData;
            this.redoStack.push(this.undoStack.pop());
            return;
        }

        this.redoStack.push(this.undoStack.pop());

        var imgSrc = this.undoStack.pop();
        this.image.src = imgSrc;
        this.undoStack.push(imgSrc);
    }

    redoChange() {
        if (this.redoStack.length == 0) return;

        var latestImg = this.redoStack.pop();
        this.undoStack.push(latestImg);

        this.image.src = latestImg;
    }

    render() {
        return (
            <Container fluid>

                <Navbar style={{ backgroundColor: 'rgb(240, 240, 240)' }} expand="lg" fixed="top">
                    <Link to={{ pathname: '/home' }}><Navbar.Brand><GiStethoscope /> {this.state.info.fname} {this.state.info.lname}</Navbar.Brand></Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link><Link style={{ textDecoration: 'none', color: 'grey' }} to={{ pathname: "/insertImage" }}><RiImageAddFill /> Insert new image</Link></Nav.Link>
                            <BsPencil className='my-auto ml-3' />
                            <NavDropdown title={this.state.penColor} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => { this.setState({ penColor: 'Red' }) }}>
                                    <BsSquareFill style={{ color: 'red' }} /> Red
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { this.setState({ penColor: 'Blue' }) }}>
                                    <BsSquareFill style={{ color: 'blue' }} /> Blue
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { this.setState({ penColor: 'Black' }) }}>
                                    <BsSquareFill style={{ color: 'black' }} /> Black
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { this.setState({ penColor: 'Yellow' }) }}>
                                    <BsSquareFill style={{ color: 'yellow' }} /> Yellow
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { this.setState({ penColor: 'White' }) }}>
                                    <BsSquareFill style={{ color: 'white' }} /> White
                                </NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title={this.state.penWidth} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => { this.setState({ penWidth: 'Fine' }) }}>
                                    <AiOutlineLine size={10} /> Fine
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { this.setState({ penWidth: 'Regular' }) }}>
                                    <AiOutlineLine size={20} /> Regular
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { this.setState({ penWidth: 'Coarse' }) }}>
                                    <AiOutlineLine size={30} /> Coarse
                                </NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title={this.state.shape} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => { this.setState({ shape: 'Rectangle', drawingShape: true }) }}>
                                    <BiRectangle size={20} /> Rectangle
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { this.setState({ shape: 'Circle', drawingShape: true }) }}>
                                    <RiCheckboxBlankCircleLine size={20} /> Circle
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => { this.setState({ shape: 'Line', drawingShape: true }) }}>
                                    <AiOutlineLine size={20} /> Line
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Button variant='outline-dark' onClick={this.saveImage} className='mx-2'>Save a Copy</Button>
                            <Button variant='outline-dark' onClick={this.sendImage} className='mx-2'>Send Changes</Button>
                        </Nav>
                        <GrUndo size={30} onClick={this.undoChange} className='my-auto mx-2' />
                        <GrRedo size={30} onClick={this.redoChange} className='my-auto mx-4' />
                    </Navbar.Collapse>
                </Navbar>

                {
                    this.state.info.imageData != null &&
                    <Row className='sticky-top mt-6 mb-2'>
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
                }

                <Row className='mb-5'>
                    <Col>
                        {this.state.isLoading && <Spinner className="mt-3" animation="border" />}
                        {!this.state.isLoading && <MessageList imageData={this.state.info.imageData} userId={this.userId} messages={this.state.messages} />}
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
                        <Button className='btn btn-block' variant="outline-success" onClick={this.sendMessage} type="button">Send</Button>
                    </Col>

                </Row>

            </Container>
        );
    }

}

const MessageList = (props) => {
    let messageList = [];
    let i = 0;

    if (props.imageData == null && props.messages.length > 0 && props.messages[0].text.length > 0) {
        if (props.userId == props.messages[i].senderId) {
            messageList.push(
                <Container className='mt-6 float-right'>
                    <Alert variant='success'>{props.messages[i].text}</Alert>
                </Container>
            );
        } else {
            messageList.push(
                <Container className='mt-6 float-left'>
                    <Alert variant='primary'>{props.messages[i].text}</Alert>
                </Container>
            );
        }
        i++;
    }

    for (; i < props.messages.length; i++) {
        if (props.messages[i].text.length == 0) continue;
        if (props.userId == props.messages[i].senderId) {
            messageList.push(
                <Container className='float-right'>
                    <Alert variant='success'>{props.messages[i].text}</Alert>
                </Container>
            );
        } else {
            messageList.push(
                <Container className='float-left'>
                    <Alert variant='primary'>{props.messages[i].text}</Alert>
                </Container>
            );
        }

    }

    return messageList;
}

export default Message;