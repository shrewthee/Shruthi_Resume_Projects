

import Carousel from 'react-bootstrap/Carousel';
import * as contentful from 'contentful'
import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './../styles/Slider.css' 
import Card from 'react-bootstrap/Card';



const client = contentful.createClient({
    space: 'pyc53vnzloup',
    environment: 'master', // defaults to 'master' if not set
    accessToken: '7vjrEcg4rZ4Zl6f_ZfzTpl0znUW-0EiTe1Z7l3_qvxA'
})


function Slider() {

    const [data, setData] = useState([]);

    const getData = () => {
        client.getEntries({
            content_type: 'carousel'
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
                <Card>
                <Card.Img variant="top" src= {item.fields.image} />
                <Card.Body>
                  <Card.Title>{item.fields.title}</Card.Title>
                  <Card.Text>
                    {item.fields.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            )
        })
    }









    // return (


       
    // );
}

export default Slider;