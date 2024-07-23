import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function District() {
  const [districtDetails, setDistrictDetails] = useState([]);

  const handleSubmit = async (e) => {
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
      let result = await fetch("http://localhost:3000/api/v1/users/addDistrict", {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
      
       toast.success("District Added Successfully successfully.");
       setTimeout(() => {
        window.location.reload();
       }, 2000);
      } else {
        toast.error("Error in Adding District:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding District:", error.message);
    }
  };

  const handleDelete = async (DistCode) =>{
    try {
      let result = await fetch("http://localhost:3000/api/v1/users/deleteDistrictDetail", {
        method: 'POST',
        body: JSON.stringify({DistCode}),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
      toast.success("District Added Successfully successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      } else {
        toast.error("Error in Adding District:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding District:", error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/v1/users/getDistrictDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          toast.error('Failed to fetch user data');
        }
        const data = await response.json();
        setDistrictDetails(data);
      } catch (error) {
        toast.error('Error fetching user data:', error);
      }
    };
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user ? user.role : "";

    console.log(role);
    if (role === 'Super Admin') {
      fetchData();
    }
    // at time of submit kr skte h bd me krege
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'index',
        header: 'S.No',
        size: 10,
        Cell: ({ row }) => row.index + 1
      },
      {
        accessorKey: 'action',
        header: 'Action',
        size: 10,
        Cell: ({ row }) => (
          <>
            <Button variant="primary" className="edit">
              <Link
                to={{ pathname: "/editDistrictDetails", search: `?content=${row.original.DistCode}` }}
              >
                Edit
              </Link>
            </Button>
            <Button variant="danger"  onClick={() => handleDelete(row.original.DistCode)} className="delete" type='button'>
              
                Delete
              
            </Button>
          </>
        ),
      },
      {
        accessorKey: 'DistCode',
        header: 'District Code',
        size: 10,
      },
      {
        accessorKey: 'EDistrict',
        header: 'District Name(English)',
        size: 50,
      },
      {
        accessorKey: 'HDistrict',
        header: 'District Name(Hindi)',
        size: 50,
      },
      {
        accessorKey: 'ESGraduate',
        header: 'Constituencies (English)',
        size: 50,
      },
      {
        accessorKey: 'HSGraduate',
        header: 'Constituencies (Hindi)',
        size: 50,
      }
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: districtDetails,
  });

  return (
    <main className="bg-gray-100">
      <ToastContainer/>
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Add District</h1>
        <Form onSubmit={handleSubmit} className="District-form">
          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>District Code<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="District Code" id="DistCode" name="DistCode" required />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>District Name(English)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="District Name(English)" id="EDistrict" name="EDistrict" required />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>District Name(Hindi)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="District Name(Hindi)" id="HDistrict" name="HDistrict" required />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Constituencies (English)<sup className='text-red-600'>*</sup> </Form.Label>
                <Form.Control type="text" placeholder="Constituencies (English)" id="ESGraduate" name="ESGraduate" required />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Constituencies (Hindi)<sup className='text-red-600'>*</sup> </Form.Label>
                <Form.Control type="text" placeholder="Constituencies (Hindi)" id="HSGraduate" name="HSGraduate" required />
              </Form.Group>
            </div>
          </Row>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

        <hr className="my-4" />

        <h4 className="container mt-3 text-xl font-bold mb-2">District</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
};

export default District;
