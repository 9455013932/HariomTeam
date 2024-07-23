import React, {useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditDistrictDetails() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const content = searchParams.get('content');


  const [districtDetails, setDistrictDetails] = useState([]);
  const [formData, setFormData] = useState({
    DistCode: content || '', // Set initial value to content
    EDistrict: '',
    HDistrict: '',
    ESGraduate: '',
    HSGraduate: ''
  });
  

  const handleEdit = async (e) => {
    e.preventDefault();

    // Gather form data
    const DistCode = document.getElementById("DistCode").value;
    const EDistrict = document.getElementById("EDistrict").value;
    const HDistrict = document.getElementById("HDistrict").value;
    const ESGraduate = document.getElementById("ESGraduate").value;
    const HSGraduate = document.getElementById("HSGraduate").value;

    const requestBody = {
      DistCode,
      EDistrict,
      HDistrict,
      ESGraduate,
      HSGraduate
    };

    try {
      let result = await fetch("http://localhost:3000/api/v1/users/updateDistrictDetail", {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
     
        toast.success("District Updated successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Error in Updating District:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in updating District:", error.message);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
        if (!content) return; 

        try {
            const response = await fetch(`http://localhost:3000/api/v1/users/getDistrictDetails`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch district details');
            }
            const data = await response.json();

            // Check if data is an array and has at least one element
            if (Array.isArray(data) && data.length > 0) {
                const district = data.find(item => item.DistCode === content); // Find district with matching DistCode
                
                if (district) {
                    setDistrictDetails(district);
                    setFormData(district); // Set form data with fetched district details
                } else {
                    throw new Error(`District with DistCode ${content} not found`);
                }
            } else {
                // Handle case where response data is empty or not in expected format
                throw new Error('Empty or invalid district details data');
            }

        } catch (error) {
            toast.error('Error fetching district details:', error);
        }
    };

    fetchData();
}, [content]);



  return (
    <main className="bg-gray-100">
      <ToastContainer/>
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Add District</h1>
        <Form onSubmit={handleEdit} className="District-form">
          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>District Code<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="District Code" id="DistCode" name="DistCode" value={content} readOnly />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>District Name(English)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="District Name(English)" id="EDistrict" name="EDistrict" value={formData.EDistrict || ''}   onChange={(e) => setFormData({ ...formData, EDistrict: e.target.value })} required />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>District Name(Hindi)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="District Name(Hindi)" id="HDistrict" name="HDistrict" value={formData.HDistrict || ''}  onChange={(e) => setFormData({ ...formData, HDistrict: e.target.value })} required />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Constituencies (English)<sup className='text-red-600'>*</sup> </Form.Label>
                <Form.Control type="text" placeholder="Constituencies (English)" id="ESGraduate" name="ESGraduate" value={formData.ESGraduate || ''}  onChange={(e) => setFormData({ ...formData, ESGraduate: e.target.value })} required />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Constituencies (Hindi)<sup className='text-red-600'>*</sup> </Form.Label>
                <Form.Control type="text" placeholder="Constituencies (Hindi)" id="HSGraduate" name="HSGraduate" value={formData.HSGraduate || ''}  onChange={(e) => setFormData({ ...formData, HSGraduate: e.target.value })} required />
              </Form.Group>
            </div>
          </Row>

          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>

        <hr className="my-4" />

       
      </div>
    </main>
  );
};

export default EditDistrictDetails;
