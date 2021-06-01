import React from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import RadioLogicService from '../../services/RadioLogicService';

class Message extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [], isLoading: true, isError: false
        };
    }

    // This method populates the message list by making a call to RadioLogicService
    async componentDidMount() {
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

    render() {
        return (
            <Container fluid>
                {this.state.isLoading && <Spinner className="mt-3" animation="border" />}
                {!this.state.isLoading && <MessageList userId={this.props.location.chat.userId} messages={this.state.messages} />}
            </Container>
        );
    }

}

const MessageList = (props) => {
    let messageList = [];

    for (let i = 0; i < props.messages.length; i++) {
        if (props.userId == props.messages[0].senderId) {
            messageList.push(
                <Container className='float-left my-1'>
                    <Alert variant='primary'>{props.messages[i].text}</Alert>
                </Container>
            );
        } else {
            messageList.push(
                <Container className='float-right my-1'>
                    <Alert variant='success'>{props.messages[i].text}</Alert>
                </Container>
            );
        }
        
    }

    return messageList;
}

export default Message;