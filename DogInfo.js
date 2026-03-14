import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import * as contentful from 'contentful'
import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './../App.css'

const client = contentful.createClient({
    space: 'pyc53vnzloup',
    environment: 'master', // defaults to 'master' if not set
    accessToken: '7vjrEcg4rZ4Zl6f_ZfzTpl0znUW-0EiTe1Z7l3_qvxA'
})


function DogInfo() {

    const [data, setData] = useState([]);

    const getData = () => {
        client.getEntries({
            content_type: 'accordian'
        })

            .then((response) => {
                setData(response.items);
            })
    }

    useEffect(() => {
        getData();
    }, [])

    const getInformation = () => {

        const outputArray = []
        data.forEach((item) => {
            outputArray.push(
                <Tab eventKey= {item.fields.breed} title={item.fields.breed}>
                    {item.fields.description}
                </Tab>
            )
        })
         return <Tabs>{outputArray}</Tabs>

    }
    return (
      
        <>
        <Container>
            <Row className = 'dog-info'>
                <Col className = 'mt-5 mb-10'>
                {getInformation()}
                </Col>
            </Row>
        </Container>
        </>
    );
}
export default DogInfo;