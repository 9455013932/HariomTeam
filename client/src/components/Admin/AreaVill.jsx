import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Select from 'react-select'; 
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AreaVill() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const content = searchParams.get('content');

  const [AreaVillDetails, setAreaVillDetails] = useState([]);
  const [formData, setFormData] = useState({
    Id: content || '',
    EAreaVill: '',
    HAreaVill: '',
    HnoRange: '',
    EWardBlock: '',
    WBID: '',
    CBPId: '',
    ECBPanch: ''
  });

  const [wbOptions, setWBOptions] = useState([]);
  const [cbOptions, setCBOptions] = useState([]);

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
          throw new Error('Failed to fetch Ward block options');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Empty or invalid Ward block options data');
        }
        // Map data to an array of { value, label } objects
        const options = data.map(wb => ({ value: wb.Id, label: `${wb.WardNo} - ${wb.EWardBlock}` }));
        setWBOptions(options);
      } catch (error) {
        console.error('Error fetching wb options:', error);
      }
    };

    fetchWBOptions();
  }, []);

  const fetchCBOptions = async (wbId) => {
    try {
      const response = await fetch(`/api/v1/admin/chakBlockDetails`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chakblock options');
      }
      const data = await response.json();
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Empty or invalid chakblock options data');
      }

      const options = data
        .filter(CB => CB.WBId == wbId)
        .map(CB => ({ value: CB.Id, label: CB.ChakNo + "  - " + CB.ECBPanch }));

      setCBOptions(options);
    } catch (error) {
      console.error('Error fetching CB options:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/admin/AreaVillDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch AreaVill details');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Empty or invalid AreaVill details data');
        }
        setAreaVillDetails(data);
        if (content) {
          const AreaVill = data.find(item => item.Id == content);
          if (AreaVill) {
            setFormData({
              WBID: AreaVill.WBId,
              EAreaVill: AreaVill.EAreaVill,
              HAreaVill: AreaVill.HAreaVill,
              HnoRange: AreaVill.HnoRange,
              EWardBlock: AreaVill.EWardBlock,
              CBPId: AreaVill.CBPId,
              ECBPanch: AreaVill.ECBPanch
              //hariom
            });

            fetchCBOptions(AreaVill.WBId);
          } else {
            console.error(`AreaVill with ID ${content} not found`);
          }
        }
      } catch (error) {
        console.error('Error fetching AreaVill data:', error);
      }
    };

    fetchData();
  }, [content]);

  // Effect to ensure formData is set correctly once wbOptions are available
  // useEffect(() => {
  //   if (formData.WBID && wbOptions.length > 0) {
  //     const selectedWB = wbOptions.find(option => option.value === formData.WBID);
  //     if (selectedWB) {
  //       setFormData(prevFormData => ({
  //         ...prevFormData,
  //         WBID: selectedWB.value
  //       }));
  //     }
  //   }
  // }, [wbOptions, formData.WBID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch("/api/v1/admin/addAreaVill", {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        window.location.reload();
        console.log("AreaVill Added Successfully.");
      } else {
        console.error("Error in Adding AreaVill:", result.statusText);
      }
    } catch (error) {
      console.error("Error in Adding AreaVill:", error.message);
    }
  };

  const handleChange = (selectedOption, name) => {

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: selectedOption.value
    }));

    if (name === 'WBID') {
      fetchCBOptions(selectedOption.value);
    }
  };

  const handleDelete = async (Id) => {
    try {
      const response = await fetch("/api/v1/Admin/deleteAreaVillDetail", {
        method: 'POST',
        body: JSON.stringify({ Id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete AreaVill');
      }

      toast.success("AreaVill deleted successfully.");
      setTimeout(() => {
        window.location.reload()
      }, 100);
    } catch (error) {
      toast.error("Error deleting AreaVill:", error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const result = await fetch("/api/v1/admin/updateAreaVillDetail", {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });



      if (result.ok) {
        window.location.href = '/AreaVill';

        toast.success("AreaVill Updated successfully.");
      } else {
        toast.error("Error in Updating AreaVill:", result.statusText);
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
              to={{ pathname: "/AreaVill", search: `?content=${row.original.Id}` }}

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
      accessorKey: 'ECBPanch',
      header: 'Chak Block',
      size: 20,
    },
    {
      accessorKey: 'EAreaVill',
      header: 'AreaVill Name (English)',
      size: 20,
    },
    {
      accessorKey: 'HAreaVill',
      header: 'AreaVill Name (Hindi)',
      size: 20,
    },
    {
      accessorKey: 'HnoRange',
      header: 'HNo Range',
      size: 5,
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: AreaVillDetails,
  });

  return (
    <main className="bg-gray-100">
      <ToastContainer />
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Add AreaVill</h1>
        <Form onSubmit={content ? handleEdit : handleSubmit} className="AreaVill-form">
          <Row className="mb-3">

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Select Ward Block</Form.Label>
                <Select
                  id="wbSelect"
                  name="WBID"
                  value={wbOptions.find(option => option.value == formData.WBID)}
                  onChange={(selectedOption) => handleChange(selectedOption, 'WBID')}
                  // onChange={option => setFormData(prevFormData => ({ ...prevFormData, WBID: option.value }))}

                  options={wbOptions}
                  placeholder="Select Ward Block"
                  isSearchable={true} // Enable search
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Select Chak Block<sup className='text-red-600'>*</sup></Form.Label>
                <Select
                  id="CBSelect"
                  name="CBPId"
                  value={cbOptions.find(option => option.value === formData.CBPId)}
                  onChange={(selectedOption) => handleChange(selectedOption, 'CBPId')}
                  options={cbOptions}
                  placeholder="Select Chak Block"
                  isSearchable={true} // Enable search
                  required
                />
              </Form.Group>
            </div>

            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>Hno Range<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Hno Range" id="HnoRange" name="HnoRange" value={formData.HnoRange} onChange={(e) => setFormData(prevFormData => ({ ...prevFormData, HnoRange: e.target.value }))} />
              </Form.Group>
            </div>
          </Row>

          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>AreaVill Name (English)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="AreaVill Name (English)" id="EAreaVill" name="EAreaVill" value={formData.EAreaVill} onChange={(e) => setFormData(prevFormData => ({ ...prevFormData, EAreaVill: e.target.value }))} required />
              </Form.Group>
            </div>
            <div className="col-md-3 mb-3">
              <Form.Group >
                <Form.Label>AreaVill Name (Hindi)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="AreaVill Name (Hindi)" id="HAreaVill" name="HAreaVill" value={formData.HAreaVill} onChange={(e) => setFormData(prevFormData => ({ ...prevFormData, HAreaVill: e.target.value }))} required />
              </Form.Group>
            </div>
          </Row>

          <Button variant="primary" type="submit">
            {content ? 'Update' : 'Submit'}
          </Button>
        </Form>
        <hr className="my-4" />
        <h4 className="container mt-3 text-xl font-bold mb-3">AreaVill List</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
}

export default AreaVill;
