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

function VidhanSabha() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const content = searchParams.get('content');

  const [VidhanSabhaDetails, setVidhanSabhaDetails] = useState([]);
  const [formData, setFormData] = useState({
    Id: content || '',
    EVidhanSabha: '',
    HVidhanSabha: '',
    VSNo: '',
    EName: '',
    TehId: '',
    counId: '',
    Ecouncil: ''
  });

  const [tehsilOptions, setTehsilOptions] = useState([]);
  const [councilOptions, setCouncilOptions] = useState([]);

  useEffect(() => {
    const fetchTehsilOptions = async () => {
      try {
        const response = await fetch('/api/v1/admin/tehsilDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch Tehsil options');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Empty or invalid Tehsil options data');
        }
        // Map data to an array of { value, label } objects
        const options = data.map(tehsil => ({ value: tehsil.Id, label: tehsil.EName }));
        setTehsilOptions(options);
      } catch (error) {
        toast.error('Error fetching Tehsil options:', error);
      }
    };

    fetchTehsilOptions();
  }, []);

  const fetchCouncilOptions = async (tehId) => {
    console.log(tehId);
    try {
      const response = await fetch(`/api/v1/admin/councilDetails`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch council options');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Empty or invalid council options data');
      }


      const options = data
        .filter(council => council.TehId == tehId) // Filter based on Tehid
        .map(council => ({ value: council.Id, label: council.ECouncil }));



      setCouncilOptions(options);
    } catch (error) {
      toast.error('Error fetching Council options:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/admin/vidhanSabhaDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch VidhanSabha details');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Empty or invalid VidhanSabha details data');
        }
        setVidhanSabhaDetails(data);
        if (content) {
          const VidhanSabha = data.find(item => item.Id == content);
          if (VidhanSabha) {
            setFormData(VidhanSabha);
            console.log("set ", formData.counId);
            fetchCouncilOptions(VidhanSabha.counId);
          } else {
            toast.error(`VidhanSabha with ID ${content} not found`);
          }
        }
      } catch (error) {
        toast.error('Error fetching VidhanSabha data:', error);
      }
    };

    fetchData();
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch("/api/v1/admin/addVidhanSabha", {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {

        toast.success("VidhanSabha Added Successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Error in Adding VidhanSabha:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding VidhanSabha:", error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Update the formData with the new value
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));

    if (name === 'TehId') {
      fetchCouncilOptions(value);

    }

  };

  const handleDelete = async (Id) => {
    try {
      let result = await fetch("/api/v1/Admin/deleteVidhanSabhaDetail", {
        method: 'POST',
        body: JSON.stringify({ Id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {

        toast.success("VidhanSabha Added Successfully successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Error in Adding VidhanSabha:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding VidhanSabha:", error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();



    try {
      const result = await fetch("/api/v1/admin/updateVidhanSabhaDetail", {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });


      if (result.ok) {
        toast.success("VidhanSabha Updated successfully.");
        setTimeout(() => {
          window.location.href = '/VidhanSabha';
        }, 1000);
      } else {
        toast.error("Error in Updating VidhanSabha:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in updating :", error.message);
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
              to={{ pathname: "/VidhanSabha", search: `?content=${row.original.Id}` }}
            >
              Edit
            </Link>
          </Button>
          <Button variant="danger" onClick={() => handleDelete(row.original.Id)} className="delete" type='button'>
            Delete
          </Button>
        </>
      ),
    },
    {
      accessorKey: 'EName',
      header: 'Tehsil',
      size: 20,
    },
    {
      accessorKey: 'ECouncil',
      header: 'Nikaya',
      size: 20,
    },
    {
      accessorKey: 'VSNo',
      header: 'VSNo',
      size: 5,
    },
    {
      accessorKey: 'EVidhanSabha',
      header: 'VidhanSabha Name (English)',
      size: 20,
    },
    {
      accessorKey: 'HVidhanSabha',
      header: 'VidhanSabha Name (Hindi)',
      size: 20,
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: VidhanSabhaDetails,
  });

  return (
    <main className="bg-gray-100">
      <ToastContainer />
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Add VidhanSabha</h1>
        <Form onSubmit={content ? handleEdit : handleSubmit} className="VidhanSabha-form">
          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Select Tehsil<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Select
                  id="tehsilSelect"
                  name="TehId"
                  value={formData.TehId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Tehsil</option>
                  {tehsilOptions.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Select Nikaya<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Select
                  id="CouncilSelect"
                  name="counId"
                  value={formData.counId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Nikaya</option>
                  {councilOptions.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>VidhanSabha No<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="VidhanSabha No" id="VSNo" name="VSNo" value={formData.VSNo} onChange={handleChange} required />
              </Form.Group>
            </div>
          </Row>

          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>VidhanSabha Name (English)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="VidhanSabha Name (English)" id="EVidhanSabha" name="EVidhanSabha" value={formData.EVidhanSabha} onChange={handleChange} required />
              </Form.Group>
            </div>
            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>VidhanSabha Name (Hindi)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="VidhanSabha Name (Hindi)" id="HVidhanSabha" name="HVidhanSabha" value={formData.HVidhanSabha} onChange={handleChange} required />
              </Form.Group>
            </div>
          </Row>

          <Button variant="primary" type="submit">
            {content ? 'Update' : 'Submit'}
          </Button>
        </Form>
        <hr className="my-4" />
        <h4 className="container mt-3 text-xl font-bold mb-3">VidhanSabha List</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
}

export default VidhanSabha;
