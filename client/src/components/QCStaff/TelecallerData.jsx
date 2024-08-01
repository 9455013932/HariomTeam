import React, { useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

const TelecallerData = () => {
  const [data, setData] = useState([]);
  const [employNameOption, setEmployNameOption] = useState([]);    //the fetched data is given to setEmployeeNameOption
  const [distinctAssignTo, setDistinctAssignTo] = useState([]);  //Extract distinct AssignTo values by using mapfunction and given to it 
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v1/qualitystaff/employeeDetails", { // Ensure this URL is correct and accessible
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch IncomingForms details");
        }

        const data = await response.json();

        if (!data) {
          throw new Error("Empty or invalid details data");
        }
        setEmployNameOption(data);
        console.log(data);

        // Extract distinct AssignTo values
        const distinctAssignToValues = [...new Set(data.map(item => item.AssignTo))];
        setDistinctAssignTo(distinctAssignToValues);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedEmployee === 'all') {
      setData(employNameOption);
    } else {
      const selectedData = employNameOption.filter(details => details.AssignTo === selectedEmployee);
      setData(selectedData);
    }
    console.log(`Selected employee data:`, data);
  };

  const columns = useMemo(() => [
    // Columns definition
    {
      accessorKey: 'sr_no',
      header: 'Sr No',
      size: 40,
    },
    {
      accessorKey: 'CreatedDate',
      header: 'Created Date',
      size: 50,
    },
    {
      accessorKey: 'LastModifiedDate',
      header: 'Last Modified Date',
      size: 50,
    },
    {
      accessorKey: 'ImportedBy',
      header: 'Imported By',
      size: 50,
    },
    {
      accessorKey: 'LeadNo',
      header: 'Lead No',
      size: 50,
    },
    {
      accessorKey: 'FirstName',
      header: 'First Name',
      size: 50,
    },
    {
      accessorKey: 'LastName',
      header: 'Last Name',
      size: 50,
    },
    {
      accessorKey: 'CountryCode',
      header: 'Country Code',
      size: 50,
    },
    {
      accessorKey: 'PhoneNo',
      header: 'Phone No',
      size: 50,
    },
    {
      accessorKey: 'AlternateCountryCode',
      header: 'Alternate Country Code',
      size: 50,
    },
    {
      accessorKey: 'AlternatePhoneNo',
      header: 'Alternate Phone Number',
      size: 50,
    },
    {
      accessorKey: 'NoOfAttempts',
      header: 'Number Of Attempts',
      size: 50,
    },
    {
      accessorKey: 'LeadTags',
      header: 'Lead Tags',
      size: 50,
    },
    {
      accessorKey: 'LastCallEmployee',
      header: 'Last Call Employee',
      size: 50,
    },
    {
      accessorKey: 'LastCallTime',
      header: 'Last Call Time',
      size: 50,
    },
    {
      accessorKey: 'LastCallType',
      header: 'Last Call Type',
      size: 50,
    },
    {
      accessorKey: 'LastCallDuration',
      header: 'Last Call Duration',
      size: 50,
    },
    {
      accessorKey: 'LastCallNote',
      header: 'Last Call Note',
      size: 50,
    },
    {
      accessorKey: 'AssignTo',
      header: 'Assign To',
      size: 50,
    },
    {
      accessorKey: 'LeadStatus',
      header: 'Lead Status',
      size: 50,
    },
    {
      accessorKey: 'Reminder',
      header: 'Reminder',
      size: 50,
    },
    {
      accessorKey: 'CompanyName',
      header: 'Company Name',
      size: 50,
    },
    {
      accessorKey: 'Email',
      header: 'Email',
      size: 50,
    },
    {
      accessorKey: 'Address1',
      header: 'Address 1',
      size: 50,
    },
    {
      accessorKey: 'Address2',
      header: 'Address 2',
      size: 50,
    },
    {
      accessorKey: 'City',
      header: 'City',
      size: 50,
    },
    {
      accessorKey: 'State',
      header: 'State',
      size: 50,
    },
    {
      accessorKey: 'Zipcode',
      header: 'Zipcode',
      size: 50,
    },
    {
      accessorKey: 'Country',
      header: 'Country',
      size: 50,
    },
    {
      accessorKey: 'Description',
      header: 'Description',
      size: 50,
    },
    {
      accessorKey: 'Source',
      header: 'Source',
      size: 50,
    },
    {
      accessorKey: 'Price',
      header: 'Price',
      size: 50,
    },
  ], []);

  const table = useMaterialReactTable({ columns, data });

  return (
    <main className='bg-gray-100'>
      <div className='container py-4 pl-6 text-black'>
        <h1 className='text-2xl font-bold mb-4'>Telecaller Data</h1>
        <form className='employee-form' onSubmit={handleSubmit}>
          <Row className="mb-3">
            <div className='col-md-3 mb-3' style={{ zIndex: 10 }}>
              <Form.Group>
                <Form.Label>Select Employee<sup className='text-red-600'>*</sup></Form.Label><br />
                <select 
                  name='Emid' 
                  id='EMselect' 
                  value={selectedEmployee} // Set the value to selectedEmployee state
                  onChange={(e) => setSelectedEmployee(e.target.value)} // Update the selectedEmployee state on change
                  placeholder="Select Employee"
                >
                  <option value=''>Select Employee</option>
                  <option value='all'>Select All</option>
                  {distinctAssignTo.map((assignTo, index) => (
                    <option key={index} value={assignTo}>
                      {assignTo} 
                    </option>
                  ))}
                </select>
              </Form.Group>
            </div>
          </Row>
          <Button variant="primary" type='submit'>Submit</Button>
        </form>

        <hr className='my-4' />
        <h4 className='container mt-3 text-xl font-bold mb-3'>Employee Details</h4>
        <div className="overflow-x-auto" style={{ zIndex: -1 }}>
          <MaterialReactTable table={table} /> {/* Ensure the table is rendered correctly */}
        </div>
      </div>
      <ToastContainer /> {/* Add ToastContainer for notifications */}
    </main>
  );
}

export default TelecallerData;
