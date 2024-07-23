import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Box, Button as MUIButton } from '@mui/material';
import Button from 'react-bootstrap/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PollingStationList() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const content = searchParams.get('content');
  const [PSListDetails, setPSListDetails] = useState([]);
  const [formData, setFormData] = useState({
    Id: content || '',
    DId: '',
    ESPArea: '',
    HSPArea: '',
    PSNo: '',
    ESPName: '',
    HSPName: '',
    RoomNo: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/admin/pSListDetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch PollingStationList details');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Empty or invalid PollingStationList details data');
        }
        setPSListDetails(data);
        if (content) {
          const PollingStationList = data.find(item => item.Id == content);

          if (PollingStationList) {
            setFormData(PollingStationList);
          } else {
            toast.error(`PollingStationList with ID ${content} not found`);
          }
        }
      } catch (error) {
        toast.error('Error fetching PollingStationList data:', error);
      }
    };

    fetchData();
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch("/api/v1/admin/addPSList", {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success("PollingStationList Added Successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Error in Adding PollingStationList:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in Adding PollingStationList:", error.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch("/api/v1/admin/updatePSListDetail", {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        toast.success("PollingStationList Updated successfully.");
        setTimeout(() => {
          window.location.href = '/PollingStationList';
        }, 500);
      } else {
        toast.error("Error in Updating PollingStationList:", result.statusText);
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
      let result = await fetch("/api/v1/Admin/deletePSListDetail", {
        method: 'POST',
        body: JSON.stringify({ Id }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
        toast.success("PollingStationList deleted successfully.");
      } else {
        toast.error("Error in deleting PollingStationList:", result.statusText);
      }
    } catch (error) {
      toast.error("Error in deleting PollingStationList:", error.message);
    }
  };

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  const handleExport = (rows, format) => {
    const exportData = rows.map((row, index) => ({
      "S.No": index + 1,
      "PS Area (English)": row.original.ESPArea,
      "PS Area (Hindi)": row.original.HSPArea,
      "PS No.": row.original.PSNo,
      "PS Name (English)": row.original.ESPName,
      "PS Name (Hindi)": row.original.HSPName,
      "Room No.": row.original.RoomNo,
    }));

    if (format === 'csv') {
      const csv = generateCsv(csvConfig)(exportData);
      download(csvConfig)(csv);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      const tableData = exportData.map(row => Object.values(row));
      const tableHeaders = ["S.No", "PS Area (English)", "PS Area (Hindi)", "PS No.", "PS Name (English)", "PS Name (Hindi)", "Room No."];
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
      });
      doc.save('PollingStationList-export.pdf');
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'Serial No',
      header: 'S.No',
      size: 5,
      Cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'Action',
      header: 'Action',
      size: 10,
      Cell: ({ row }) => (
        <>
          <Button variant="primary" className="changepassword">
            <Link to={{ pathname: "/PollingStationList", search: `?content=${row.original.Id}` }}>
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
      accessorKey: 'ESPArea',
      header: 'PS Area (English)',
      size: 20,
    },
    {
      accessorKey: 'HSPArea',
      header: 'PS Area (Hindi)',
      size: 20,
    },
    {
      accessorKey: 'PSNo',
      header: 'PS No.',
      size: 20,
    },
    {
      accessorKey: 'ESPName',
      header: 'PS Name(English)',
      size: 20,
    },
    {
      accessorKey: 'HSPName',
      header: 'PS Name (Hindi)',
      size: 20,
    },
    {
      accessorKey: 'RoomNo',
      header: 'Room No.',
      size: 20,
    },
  ], []);

  const table = useMaterialReactTable({
    columns,
    data: PSListDetails,
    // enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <MUIButton
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => handleExport(table.getPrePaginationRowModel().rows, 'csv')}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data (CSV)
        </MUIButton>
        <MUIButton
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() => handleExport(table.getPrePaginationRowModel().rows, 'pdf')}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data (PDF)
        </MUIButton>
      </Box>
    ),
  });

  return (
    <main className="bg-gray-100">
      <ToastContainer/>
      <div className="container py-4 pl-6 text-black">
        <h1 className="text-2xl font-bold mb-4">Add Polling Station</h1>
        <Form onSubmit={content ? handleEdit : handleSubmit} className="PollingStationList-form">
          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>PS Area (English)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="PS Area (English)" id="ESPArea" name="ESPArea" value={formData.ESPArea} onChange={handleChange} required />
              </Form.Group>
            </div>
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>PS Area (Hindi)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="PS Area (Hindi)" id="HSPArea" name="HSPArea" value={formData.HSPArea} onChange={handleChange} required />
              </Form.Group>
            </div>
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>PS No.<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="PS No." id="PSNo" name="PSNo" value={formData.PSNo} onChange={handleChange} required />
              </Form.Group>
            </div>
          </Row>
          <Row className="mb-3">
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>PS Name (English)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="PS Name (English)" id="ESPName" name="ESPName" value={formData.ESPName} onChange={handleChange} required />
              </Form.Group>
            </div>
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>PS Name (Hindi)<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="PS Name (Hindi)" id="HSPName" name="HSPName" value={formData.HSPName} onChange={handleChange} required />
              </Form.Group>
            </div>
            <div className="col-md-3 mb-3">
              <Form.Group>
                <Form.Label>Room No.<sup className='text-red-600'>*</sup></Form.Label>
                <Form.Control type="text" placeholder="Room No." id="RoomNo" name="RoomNo" value={formData.RoomNo} onChange={handleChange} required />
              </Form.Group>
            </div>
          </Row>
          <Button variant="primary" type="submit">
            {content ? 'Update' : 'Submit'}
          </Button>
        </Form>
        <hr className="my-4" />
        <h4 className="container mt-3 text-xl font-bold mb-3">PollingStationList List</h4>
        <div className="overflow-x-auto">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </main>
  );
}

export default PollingStationList;
