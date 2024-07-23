import React, { useEffect, useMemo, useState } from 'react'; FormData
import { Link, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';


function Caste() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const content = searchParams.get('content');

  const [casteDetails, setCasteDetails] = useState([]);
  const [formData, setFormData] = useState({
    ID: content || '', // Set initial value to content
    ESurname: '',
    HSurname: '',
    ECaste: '',
    HCaste: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/admin/casteDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch caste details');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Empty or invalid caste details data');
        }
        setCasteDetails(data);
        if (content) {
          const caste = data.find(item => { console.log(content); return item.ID == content });

          if (caste) {
            setFormData(caste);

          } else {
            toast.error(`Caste with ID ${content} not found`);
          }
        }
      } catch (error) {
        toast.error('Error fetching caste data:', error);
      }
    };

    fetchData();
  }, [content]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch("/api/v1/admin/addCaste", {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        // window.location.reload();

        toast.success("Caste Added Successfully.");
        setTimeout(() => {

          window.location.href = '/CasteManagement';
        }, 1000)
      } else {
        toast.error("Error in Adding Caste:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding Caste:", error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const ID = content
    const ESurname = document.getElementById("ESurname").value;
    const HSurname = document.getElementById("HSurname").value;
    const ECaste = document.getElementById("ECaste").value;
    const HCaste = document.getElementById("HCaste").value;

    const requestBody = {
      ID,
      ESurname,
      HSurname,
      ECaste,
      HCaste
    };
    console.log(requestBody);

    try {
      const result = await fetch("/api/v1/admin/updateCasteDetail", {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        // window.location.reload();
        setTimeout(() => { window.location.href = '/CasteManagement'; }, 1000)
        toast.success("Caste Updated successfully.");
      } else {
        toast.error("Error in Updating Caste:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in updating Caste:", error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // console.log(formData);

  const columns = useMemo(() => [
    {
      accessorKey: 'ID',
      header: 'S.No',
      size: 10,
    },
    {
      accessorKey: 'Action',
      header: 'Action',
      size: 10,
      Cell: ({ row }) => (
        <Button variant="primary" className="changepassword">
          <Link
            to={{ pathname: "/CasteManagement", search: `?content=${row.original.ID}` }}
          >
            Edit
          </Link>
        </Button>
      ),
    },
    {
      accessorKey: 'ESurname',
      header: 'Surname (English)',
      size: 20,
    },
    {
      accessorKey: 'HSurname',
      header: 'Surname (Hindi)',
      size: 20,
    },
    {
      accessorKey: 'ECaste',
      header: 'Caste (English)',
      size: 20,
    },
    {
      accessorKey: 'HCaste',
      header: 'Caste (Hindi)',
      size: 20,
    }
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: casteDetails,
  });

  return (
    <main className="bg-gray-100">
      <ToastContainer />
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Add Caste</h1>
        <Form onSubmit={content ? handleEdit : handleSubmit} className="caste-form">
          <h1 className='text-lg font-bold mb-3'>Caste Information</h1>
          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>Surname (English) <sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Surname (English)" id="ESurname" name="ESurname" value={formData.ESurname} onChange={handleChange} required />
              </Form.Group>
            </div>
            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>Surname (Hindi)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Surname (Hindi)" id="HSurname" name="HSurname" value={formData.HSurname} onChange={handleChange} required />
              </Form.Group>
            </div>
          </Row>
          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>Caste (English)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Caste (English)" id="ECaste" name="ECaste" value={formData.ECaste} onChange={handleChange} required />
              </Form.Group>
            </div>
            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>Caste (Hindi)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Caste (Hindi)" id="HCaste" name="HCaste" value={formData.HCaste} onChange={handleChange} required />
              </Form.Group>
            </div>
          </Row>
          <Button variant="primary" type="submit">
            {content ? 'Update' : 'Submit'}
          </Button>
        </Form>
        <hr className="my-4" />
        <h4 className="container mt-3 text-xl font-bold mb-2">Caste</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
}

export default Caste;
