import { Container } from 'react-bootstrap';
import ContactUs from './../components/ContactUs'

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Contact() {
    return (
        <>
            <div>
                <Container>
                    <Row>
                        <Col className= 'mt-3'>
                            <ContactUs></ContactUs>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}

export default Contact;