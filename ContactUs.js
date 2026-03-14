
import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as contentful from 'contentful-management'
import Alert from 'react-bootstrap/Alert';

const client = contentful.createClient({
  accessToken: 'CFPAT-JbIYZDH8UhPBdyreMyKFO60_TExj3H78kBpy5fSc0-I'
})

function ContactUs() {


  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [comments, setComments] = useState("");
  // const [sucsess, setSuccess]= useState(false)
  // const [error, setError]= useState(false)
  const [message,setMessage] = useState("")
  const [variant,setVariant] = useState("")
  

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    console.log(e.target.value + "----" + email);

  };

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setFirstname(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastname(e.target.value);
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if ( firstname !== "" && lastname !== "" && email !== "" && comments !== "")
    {

    client.getSpace('pyc53vnzloup')
      .then((space) => space.getEnvironment('master'))
      .then((environment) => environment.createEntryWithId('contact', Date.now(), {
        fields: {
          firstName: {
            'en-US': firstname
          },
          lastName: {
            'en-US': lastname
          },
          email: {
            'en-US': email
          },
          comments:{
            'en-US':comments
          }


        }
      }))
      .then((entry) =>
        {
        console.log(entry)
       setMessage("Your feedback has been saved succussfully.")
       setVariant("success")
       
        })
      .catch((error) =>
        {
          setMessage("There is an error." + error);
          setVariant("danger")
          
        }
      
      )
    }
    else
    {
      setMessage("Please enter all the requred fields;")
      setVariant("danger")
    }

  }

  return (
    <>
      <Form  className="mt-4" onSubmit={handleSubmit} >

        <Form.Group className="mb-3" controlId="formFirstName">
       
          <Form.Control type="text" placeholder="First Name"
            value={firstname}
            onChange={handleFirstNameChange}

          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formLastName">
       
          <Form.Control type="text" placeholder="Last Name"
            value={lastname}
            onChange={handleLastNameChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
       
          <Form.Control type="email" placeholder="Enter email"

            value={email}
            onChange={handleEmailChange} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>


        <Form.Group className="mb-3" controlId="comment">
       
       <Form.Control as="textarea" placeholder="Comments"
         value={comments}
         rows={5}
         onChange={handleCommentsChange}
       />
     </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <div className="mt-4">

      <Alert variant={variant}>
      {message}
        </Alert>

      </div>
      </>
  );
}

export default ContactUs;