import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { Redirect } from 'react-router-dom';
import RadioLogicService from '../services/RadioLogicService';

class CreateAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fname: "", lname: "", fnameError: "", lnameError: "",
            userId: "", password: "", userIdError: "", passwordError: "", redirect: false
        }
    }

    onCreate = async () => {

        let uError, pError = "";
        let fError, lError = "";
        let isError = false;

        if (this.state.fname.length < 1) {
            isError = true;
            fError = "You must provide a first name";
        }

        if (this.state.lname.length < 1) {
            isError = true;
            lError = "You must provide a last name";
        }

        if (this.state.userId.length < 5) {
            isError = true;
            uError = "Your username must be 5 or more characters";
        }

        if (this.state.password.length < 5) {
            isError = true;
            pError = "Your password must be 5 or more characters";
        }

        if (isError) this.setState({ userIdError: uError, passwordError: pError, fnameError: fError, lnameError: lError });
        else {
            try {
                let user = await RadioLogicService.getUser(this.state.userId);
                if (user.data.length != 0) this.setState({ userIdError: "This username already exists, please choose a different one", fnameError: "", lnameError: "", passwordError: "" });
                else {
                    RadioLogicService.AddUser({ userId: this.state.userId, password: this.state.password, fname: this.state.fname, lname: this.state.lname });
                    this.setState({ redirect: true });
                }
            }
            catch (err) {
                console.log(err.message);
            }

        }

    }

    render() {
        if (this.state.redirect) return <Redirect to={{ pathname: "/" }} />
        return (
            <Container>

                <h1 style={{ color: "black" }} class="m-3">Create New Account</h1>

                <Form>
                    <Form.Group class="m-2">
                        <Form.Label>First name</Form.Label>
                        <Form.Control type="text" onChange={e => this.setState({ fname: e.target.value })} placeholder="Enter your first name" />
                        <Form.Text className="text-danger">{this.state.fnameError}</Form.Text>
                    </Form.Group>

                    <Form.Group class="m-2">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control type="text" onChange={e => this.setState({ lname: e.target.value })} placeholder="Enter your last name" />
                        <Form.Text className="text-danger">{this.state.lnameError}</Form.Text>
                    </Form.Group>

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

                    <Button class="mt-3" variant="outline-success" onClick={this.onCreate} type="button">Create Account</Button>
                </Form>

            </Container>
        );
    }
}

export default CreateAccount;