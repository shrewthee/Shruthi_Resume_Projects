
import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import * as contentful from 'contentful'
import Header from './Header';


const client = contentful.createClient({
    space: 'pyc53vnzloup',
    environment: 'master', // defaults to 'master' if not set
    accessToken: '7vjrEcg4rZ4Zl6f_ZfzTpl0znUW-0EiTe1Z7l3_qvxA'
})

function Quicklinks() {

    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const getData = () => {
        client.getEntries({
            content_type: 'quicklinks'
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

        const outputArray = []
        data.forEach((item, index) => {

            if (index === 0) {
                outputArray.push(<><div><Header title={"Quicklinks"}></Header></div><a href={item.fields.url} ><ListGroup.Item>{item.fields.title}</ListGroup.Item> </a></>)
            }
            else {
                outputArray.push(<a href={item.fields.url} ><ListGroup.Item>{item.fields.title}</ListGroup.Item> </a>)
            }


        })
        return <ListGroup>{outputArray}</ListGroup>
    }

    return (
        <>
            {isLoading ? <p>Loading please wait.</p> : getContents()}
        </>
    );
}

export default Quicklinks;