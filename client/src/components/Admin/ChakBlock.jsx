import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';


function ChakBlock() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const content = searchParams.get('content');

  const [chakBlockDetails, setChakBlockDetails] = useState([]);
  const [formData, setFormData] = useState({
    Id: content || '',
    ECBPanch: '',
    HCBPanch: '',
    ChakANo: '',
    EWardBlock: '',
    WBId: undefined

  });

  const [WBOptions, setWBOptions] = useState([]);
  useEffect(() => {

    const fetchWBOptions = async () => {
      try {
        const response = await fetch('/api/v1/admin/wardBlockDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
   
        if (!response.ok) {
          throw new Error('Failed to fetch wardblock options');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Empty or invalid wardblock options data');
        }
        
        const options = data.map(wb => ({ value: wb.Id, label: `${wb.WardNo} - ${wb.EWardBlock}` }));
        setWBOptions(options);
        
      } catch (error) {
        toast.error('Error fetching wardblock options:', error);
      }
    };

    fetchWBOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/admin/chakBlockDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch ChakBlock details');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Empty or invalid ChakBlock details data');
        }
        setChakBlockDetails(data);
        if (content) {
          const ChakBlock = data.find(item => { return item.Id == content });
          if (ChakBlock) {
            setFormData(ChakBlock);
          } else {
            toast.error(`ChakBlock with ID ${content} not found`);
          }
        }
      } catch (error) {
        toast.error('Error fetching ChakBlock data:', error);
      }
    };

    fetchData();
  }, [content]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await fetch("/api/v1/admin/addChakBlock", {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
       
        toast.success("ChakBlock Added Successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Error in Adding ChakBlock:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding ChakBlock:", error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

   console.log(formData);

    try {
      const result = await fetch("/api/v1/admin/updatechakBlockDetail", {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success("ChakBlock Updated successfully.");
        setTimeout(() => {
          window.location.href = '/ChakBlock';
        }, 2000);
      } else {
        toast.error("Error in Updating ChakBlock:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in updating :", error.message);
    }
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));

  };


  const handleDelete = async (Id) => {


    try {
      let result = await fetch("/api/v1/Admin/deleteChakBlockDetail", {
        method: 'POST',
        body: JSON.stringify({ Id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
      
        toast.success("ChakBlock Added Successfully successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Error in Adding ChakBlock:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding ChakBlock:", error.message);
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
              to={{ pathname: "/ChakBlock", search: `?content=${row.original.Id}` }}
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
        accessorKey: 'EWardBlock',
        header: 'WardBlock',
        size: 20,
      },
    {
        accessorKey: 'ChakNo',
        header: 'Chak No',
        size: 20,
      },
    {
      accessorKey: 'ECBPanch',
      header: 'ChakBlock (English)',
      size: 20,
    },


    {
      accessorKey: 'HCBPanch',
      header: 'ChakBlock (Hindi)',
      size: 20,
    },
    

  ], []);

  const table = useMaterialReactTable({
    columns,
    data: chakBlockDetails,
  });

  return (
    <main className="bg-gray-100">
      <ToastContainer/>
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Add ChakBlock</h1>
        <Form onSubmit={content ? handleEdit : handleSubmit} className="ChakBlock-form">
          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Select WardBlock<sup className="text-red-600">*</sup></Form.Label>
                <Select
                  id="WBSelect"
                  name="WBId"
                  value={WBOptions.find(option => option.value === formData.WBId)}
                  onChange={option => setFormData(prevFormData => ({ ...prevFormData, WBId: option.value}))}
                  options={WBOptions}
                  placeholder="Select WardBlock"
                 
                />
              
    
              </Form.Group>
            </div>
            
            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>Chak No <sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Chak No" id="ChakNo" name="ChakNo" value={formData.ChakNo} onChange={handleChange} required />
              </Form.Group>
            </div>



            </Row>
            <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>ChakBlock Name (English)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="ChakBlock Name (English)" id="ECBPanch" name="ECBPanch" value={formData.ECBPanch} onChange={handleChange} required />
              </Form.Group>
            </div>


            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>ChakBlock Name (Hindi)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="ChakBlock Name (Hindi)" id="HCBPanch" name="HCBPanch" value={formData.HCBPanch} onChange={handleChange} required />
              </Form.Group>
            </div>
          </Row>

          <Button variant="primary" type="submit">
            {content ? 'Update' : 'Submit'}
          </Button>
        </Form>
        <hr className="my-4" />
        <h4 className="container mt-3 text-xl font-bold mb-3">ChakBlock List</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
}

export default ChakBlock;
