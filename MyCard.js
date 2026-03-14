import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';



function MyCard() {


  
  return (
    <Card >
      <Card.Img variant="top" src= "https://www.wjbf.com/wp-content/uploads/sites/47/2018/02/abc_gma_guiltydog_110323_wg_35844073_ver1.0.jpg" class = "img-fluid"></Card.Img>
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          
        </Card.Text>
        <Button variant="primary">Link</Button>
      </Card.Body>
    </Card>
  );
}

export default MyCard;

