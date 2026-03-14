
import { useState } from 'react';
import Button from 'react-bootstrap/Button';


function MyButton({ count, onClick }) {

 
    return ( 

        <Button variant="primary" onClick={onClick}>
            Clicked {count} times
        </Button>
        
     );
}

export default MyButton;