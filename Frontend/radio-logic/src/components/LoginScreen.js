import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { Redirect } from 'react-router-dom';
import RadioLogicService from '../services/RadioLogicService';

class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {user: {}, userId: "", password: "", userIdError: "", passwordError: "", redirect: false}
    }

    onLogin = async () => {

        let uError, pError = "";
        let isError = false;

        if (this.state.userId.length < 1) {
            isError = true;
            uError = "You must provide a username";
        }

        if (this.state.password.length < 1) {
            isError = true;
            pError = "You must provide a password";
        }

        if (isError) this.setState({userIdError: uError, passwordError: pError});
        else {
            try {
                let user = await RadioLogicService.getUser(this.state.userId);
                if (user.data.length === 0) this.setState({userIdError: "Please enter a valid username"})
                else if (user.data[0].password !== this.state.password) this.setState({passwordError: "Please enter a valid password", userIdError: ""})
                else {
                    sessionStorage.setItem('userId', this.state.userId);
                    this.setState({user: user, redirect: true});
                }
            }
            catch (err) {
                console.log(err.message);
            }
            
        }

    }

    render() {
        if (this.state.redirect) return <Redirect to={{ pathname: "/home" }} />
        return (
            <Container>

                <h1 style={{color:"black"}} class="m-3">RadioLogic</h1>

                <Form>
                    <Form.Group class="m-2">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" onChange={e => this.setState({ userId: e.target.value })} placeholder="Enter your username" />
                        <Form.Text className="text-danger">{this.state.userIdError}</Form.Text>
                    </Form.Group>

                    <Form.Group class="m-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" onChange={e => this.setState({ password: e.target.value })} placeholder="Enter your password" />
                        <Form.Text className="text-danger">{this.state.passwordError}</Form.Text>
                    </Form.Group>

                    <Button class="mt-3" variant="outline-success" onClick={this.onLogin} type="button">Login</Button>
                </Form>

            </Container>
        );
    }
}

export default LoginScreen;