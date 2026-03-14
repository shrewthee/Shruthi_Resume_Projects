import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';

function Test() {

    const user = {
        name: 'Hedy Lamarr',
        imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
        imageSize: 90,
      };


    let loggedIn = true;

    const products = [
        { title: 'Cabbage', id: 1 },
        { title: 'Garlic', id: 2 },
        { title: 'Apple', id: 3 },
      ];

const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

 const getData = () => {

    const outputArray =[]
    products.map(product => {
        outputArray.push( <ListGroup.Item>{product.title}</ListGroup.Item>)
    })

    return <ListGroup>{outputArray}</ListGroup>

 }
    return (  

        <>
        <Accordion defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Accordion Item #1</Accordion.Header>
        <Accordion.Body>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Accordion Item #2</Accordion.Header>
        <Accordion.Body>
        {getData()}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
        </>
    );
}

export default Test;