// This page will be diplayed whenever the user enters an invlalid url

import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

// A simple not found screen for invalid url
const NotFound = () => {
    return (
        <Container>
            <h2 className="m-2">Oops! You have navigated to a page that doesn't exist</h2>
            <Button className="m-2" variant="outline-dark" href="/">Take me back</Button>
        </Container>
    );
}

export default NotFound;