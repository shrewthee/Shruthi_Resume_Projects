
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Quicklinks from './../components/Quicklinks'
import Dog from './../components/Dog'


function Home() {
    return (
        <>
            <Container>
                <Row className='mt-4'>
                    <Col md={4}>
                        <Quicklinks></Quicklinks>
                    </Col>
                    <Col md={8} >
                        <Dog></Dog>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Home;