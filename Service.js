import React, { useState, useEffect } from 'react';
import axios from 'axios'
import ListGroup from 'react-bootstrap/ListGroup';


function Service() {

    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        const res = await axios("https://jsonplaceholder.typicode.com/todos");
        setData(res.data);
        setLoading(false)
    }

    const getContents = () => {

        const outputArray = []
        data.forEach(item => {
            outputArray.push(<ListGroup.Item>{item.title}</ListGroup.Item>)
        })

        return <ListGroup>{outputArray}</ListGroup>

    }

    return (
        isLoading ? <p>Loading.please wait</p> : getContents()
    );
}

export default Service;