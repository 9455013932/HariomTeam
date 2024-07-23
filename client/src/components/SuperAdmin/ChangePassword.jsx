import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';


function ChangePassword() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const content = searchParams.get('content');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Gather form data
    const userId = document.getElementById("userId").value;
    
    // Validate passwords
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      let result = await fetch("http://localhost:3000/api/v1/users/changePassword", {
        method: 'POST',
        body: JSON.stringify({ userId, password, confirmPassword }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (result.ok) {
        // Reload the page after successful password change
        window.location.reload();
        console.log("Password changed successfully.");
      } else {
        console.error("Error in changing password:", result.statusText);
      }
    } catch (error) {
      console.error("Error in changing password:", error.message);
    }
  };

  return (
    <main className="bg-gray-100 ">
      <div className="container mx-auto py-8 text-black">
      <h1 className="text-xl font-bold mb-4">Change Password</h1>
        <Form onSubmit={handleSubmit} className="change-form">
        <Link to="/userForm">Back to List</Link>

        <Row className="mb-3">
        <div className="col-md-4 mb-3">
              <Form.Group >
                <Form.Label>userId</Form.Label>
                <Form.Control type="text" id="userId" name="userId" value={content} readOnly />
              </Form.Group>
        </div>

        <div className="col-md-4 mb-3">
              <Form.Group >
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password" 
                name="password" 
                required />
              </Form.Group>
        </div>

        <div className="col-md-4 mb-3">
              <Form.Group >
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirmPassword" 
                name="confirmPassword" 
                required />

              </Form.Group>
            </div>
          </Row>

          <Button variant="primary" type="submit">
            Change Password
          </Button>
        
        </Form>
    </div>
    </main>
  );
}

export default ChangePassword;


