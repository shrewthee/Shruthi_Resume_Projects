
import Carousel from 'react-bootstrap/Carousel';
import React, { useState, useEffect } from 'react';
import * as contentful from 'contentful'
import Header from './Header';


const client = contentful.createClient({
    space: 'pyc53vnzloup',
    environment: 'master', // defaults to 'master' if not set
    accessToken: '7vjrEcg4rZ4Zl6f_ZfzTpl0znUW-0EiTe1Z7l3_qvxA'
})


function Dog() {


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



        const outputArray = []

        for (let x = 0; x < 1; x++) {
            if (data && data.length > 0) {
                console.log("image url " + data[x].fields.dogImage);

            }

        }

        data.forEach((item, index) => {

            if (index === 0) {
                //outputArray.push(<><div><Header title={"Spotlight"}></Header></div>
                outputArray.push(
                    <Carousel.Item key={index}>

                        <img
                            className="d-block w-100 img-fluid" 
                            src={item.fields.dogImage}
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h5 className="item-text">{item.fields.name}</h5>
                            <p className="item-text">{item.fields.briefDescription}</p>
                        </Carousel.Caption>
                    </Carousel.Item>

                )

            }
            else {
                outputArray.push(

                    <Carousel.Item key={index}>
                        <img
                            className="d-block w-100 img-fluid" style={{ height: "350px", width: "350px" }}
                            src={item.fields.dogImage}
                            alt="First slide"
                        />
                        <Carousel.Caption>
                            <h5 className="item-text">{item.fields.name}</h5>
                            <p className="item-text">{item.fields.briefDescription}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                )
            }


        })
        return <Carousel data-bs-theme="dark">{outputArray}</Carousel>
    }

    return (



        <> {getContents()}
        </>


    );
}

export default Dog;