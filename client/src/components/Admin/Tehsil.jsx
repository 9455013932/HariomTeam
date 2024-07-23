import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Tehsil() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const content = searchParams.get('content');

  const [tehsilDetails, setTehsilDetails] = useState([]);
  const [formData, setFormData] = useState({
    Id: content || '', // Set initial value to content
    EName: '',
    HName: '',
    
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/admin/tehsilDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch Tehsil details');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Empty or invalid Tehsil details data');
        }
        setTehsilDetails(data);
        if (content) {
          const Tehsil = data.find(item =>{  return item.Id == content});
     
          if (Tehsil) {
            setFormData(Tehsil);
           
          } else {
            toast.error(`Tehsil with ID ${content} not found`);
          }
        }
      } catch (error) {
        toast.error('Error fetching Tehsil data:', error);
      }
    };
  
    fetchData();
  }, [content]);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch("/api/v1/admin/addTehsil", {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
      
        toast.success("Tehsil Added Successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Error in Adding Tehsil:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding Tehsil:", error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const Id = content;
    const EName = document.getElementById("EName").value;
    const HName = document.getElementById("HName").value;


    const requestBody = {
      Id,
      EName,
      HName,
    };
    // console.log(requestBody);

    try {
      const result = await fetch("/api/v1/admin/updateTehsilDetail", {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {

 

        toast.success("Tehsil Updated successfully.");
        setTimeout(() => {
          window.location.href = '/Tehsil';
        }, 1000);
      } else {
        toast.error("Error in Updating Tehsil:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in updating :", error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (Id) =>{
  

    try {
      let result = await fetch("/api/v1/Admin/deleteTehsilDetail", {
        method: 'POST',
        body: JSON.stringify({Id}),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {

        toast.success("Tehsil Added Successfully successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.error("Error in Adding Tehsil:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding Tehsil:", error.message);
    }
  };


  const columns = useMemo(() => [
    {
      accessorKey: 'Id',
      header: 'S.No',
      size: 10,
    },
    {
      accessorKey: 'Action',
      header: 'Action',
      size: 10,
      Cell: ({ row }) => (
        <>
        <Button variant="primary" className="changepassword">
          <Link
            to={{ pathname: "/tehsil", search: `?content=${row.original.Id}` }}
          >
            Edit
          </Link>
        </Button>
        <Button variant="danger"  onClick={() => handleDelete(row.original.Id)} className="delete" type='button'>
      
                Delete
              
            </Button>
      </>
      ),
    },
    {
      accessorKey: 'EName',
      header: 'Tehsil Name (English)',
      size: 20,
    },
    {
        accessorKey: 'HName',
        header: 'Tehsil Name (Hindi)',
        size: 20,
      },
   
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: tehsilDetails,
  });

  return (
    <main className="bg-gray-100">
      <ToastContainer/>
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Add Tehsil</h1>
        <Form onSubmit={content ? handleEdit : handleSubmit} className="Tehsil-form">
          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>Tehsil Name (English)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Tehsil Name (English)" id="EName" name="EName" value={formData.EName} onChange={handleChange} required />
              </Form.Group>
            </div>
            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>Tehsil Name (Hindi)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Tehsil Name (Hindi)" id="HName" name="HName" value={formData.HName} onChange={handleChange} required />
              </Form.Group>
            </div>
          </Row>
         
          <Button variant="primary" type="submit">
            {content ? 'Update' : 'Submit'}
          </Button>
        </Form>
        <hr className="my-4" />
        <h4 className="container mt-3 text-xl font-bold mb-3">Tehsil List</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
}

export default Tehsil;
