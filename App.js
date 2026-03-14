
import './App.css';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Dog from './components/Dog';
// import Quicklinks from './components/Quicklinks';
// import Spotlight from './components/Spotlight';
// import ContactUs from './components/ContactUs';
// import DogInfo from './components/DogInfo';
import About from './pages/About';
import Contact from './pages/Contact';
import Home from './pages/Home';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navigation from "./pages/Navigation"
import DogInfo from './components/DogInfo'
import Slider from './components/Slider';



function App() {


  return (
    <div className="App">
      {/* 
      <Container>
        <Row className='mt-4'>
          <Col md={3}>
            <Quicklinks></Quicklinks>
          </Col>
          <Col md={6} >
            <Row>
              <Dog></Dog>
            </Row>
            <Row className='mt-4'>
              <Col id="my-tabcontent1" className='col-background'>
              <DogInfo></DogInfo>
              </Col>
            </Row>

            <Row className='mt-4'>
              <Col id="my-tabcontent2" className='col-background'>
              <DogInfo></DogInfo>
              </Col>
            </Row>

          </Col>
          <Col md={3}>
            <Spotlight></Spotlight>
            <ContactUs></ContactUs>
          </Col>
        </Row>



      </Container> */}
      <Navigation></Navigation>
      <Routes>
        <Route path='/' element={<Home />} />

        
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/doginfo' element={<DogInfo/>} />
        <Route path='/slider' element={<Slider/>} />
 
      </Routes>

    </div>



  );
}

export default App;
