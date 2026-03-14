import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React, { useState, useEffect } from 'react';
import * as contentful from 'contentful'


const client = contentful.createClient({
    space: 'pyc53vnzloup',
    environment: 'master', // defaults to 'master' if not set
    accessToken: '7vjrEcg4rZ4Zl6f_ZfzTpl0znUW-0EiTe1Z7l3_qvxA'
})

function Spotlight() {
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const getData = () => {
        client.getEntries({
            content_type: 'dog'
        })
            .then((response) => {
                console.log(response.items)
                setData(response.items);
                setLoading(false);
            })
            .catch(console.error)
    }
    useEffect(() => {
        getData();
    }, [])
    const getContents = () => {
        let leo = "";
        let kundi = "";
        let poop = "";
        for (let x = 0; x < 1; x++) {
            if (data && data.length > 0) {
               console.log("image url " + data[x].fields.dogImage);
                leo = data[x].fields.dogImage;
                kundi = data[x].fields.name;
                poop = data[x].fields.briefDescription;
            }
        }
        return(
        <Card >
            <Card.Img variant="top" src={leo} />
            <Card.Body>
                <Card.Title>{kundi}</Card.Title>
                <Card.Text>
                    {poop}
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
            </Card.Body>
        </Card>
        )
    }
        return (
            <> {getContents()}
            </>
        );
}
    export default Spotlight;