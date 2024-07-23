import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { Box, Button as MUIButton } from '@mui/material';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import FormsAdminInfo from './FormsAdminInfo';
import { validateFormsAdmin } from '../../Validation/formsAdminValidation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return [year, month, day].join('-');
};

const today = formatDate(new Date());

function OutgoingForms() {
    const [OFDetails, setOFListDetails] = useState([]);
    const initialFormData = {
        VMob1: '',
        VMob2: '',
        VEName: '',
        VHName: '',
        VEAddress: '',
        VHAddress: '',
        NoOfForms: '',
        SendingDate: today,
        ERemarks: '',
        CMob1: '',
        CEName: '',
        CHName: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [suggestedMobiles, setSuggestedMobiles] = useState([]);
    const [suggestedCareOfMobiles, setSuggestedCareOfMobiles] = useState([]);

    const fetchSuggestedMobiles = async (input, setter) => {
        try {
            const response = await fetch('/api/v1/formsAdmin/searchVMobNo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: input })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch suggested mobile numbers');
            }

            const data = await response.json();
            setter(data);

            console.log(suggestedCareOfMobiles);
        } catch (error) {
            console.error('Error fetching suggested mobile numbers:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/v1/FormsAdmin/outFormDetails', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch OutgoingForms details');
                }
                const data = await response.json();
                if (!data || !Array.isArray(data) || data.length === 0) {
                    throw new Error('Empty or invalid OutgoingForms details data');
                }
                setOFListDetails(data);
            } catch (error) {
                console.error('Error fetching OutgoingForms data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let formHasErrors = false;
        const newErrors = {};
        for (let key in formData) {
            const error = validateFormsAdmin(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                formHasErrors = true;
            }
        }
        setErrors(newErrors);
        if (formHasErrors) {
            toast.error("Please fix the validation errors");
            return;
        }
    
        try {
            const result = await fetch("/api/v1/FormsAdmin/addOutForm", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });
    
            if (result.ok) {
                toast.success("OutgoingForms Added Successfully.");
                // window.location.reload();
                // Reset the form data while preserving visibility of VMob1 and CMob1
                setFormData({
                    ...initialFormData,
                    VMob1: '',
                    CMob1: ''
                });
            } else {
                toast.error("Error in Adding OutgoingForms:", result.statusText);
            }
        } catch (error) {
            toast.error("Error in Adding OutgoingForms:", error.message);
        }
    };
    
    
    const calculateColumnTotals = (key) => {
        return OFDetails.reduce((sum, row) => sum + (Number(row[key]) || 0), 0);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        const error = validateFormsAdmin(name, value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };


    const columns = useMemo(() => [
        {
            accessor: (index) => index + 1,
            id: 'serialNumber',
            Header: 'S.No',
            size: 5,
            Cell: ({ cell }) => cell.row.index + 1,
            Footer: "Total"
        },
        {
            accessorKey: 'RName',
            header: 'Name',
            size: 15,
        },
        {
            accessorKey: 'RMob1',
            header: 'Mobile',
            size: 10,
        },
        {
            accessorKey: 'RAddress',
            header: 'Address',
            size: 20,
        },
        {
            accessorKey: 'NoOfForms',
            header: 'No Of Forms',
            size: 4,
            Footer: () => calculateColumnTotals('NoOfForms')
        },
        {
            accessorKey: 'C1Name',
            header: 'CO1 Name ',
            size: 15,
        },
        {
            accessorKey: 'C1Mob',
            header: 'CO1 Mobile',
            size: 10,
        },
        {
            accessorKey: 'SendingDate',
            header: 'Sending Date',
            size: 8,
        },
        {
            accessorKey: 'ERemark',
            header: 'Remarks',
            size: 25,
        },
    ], [OFDetails]);

    const handleExport = (rows, format) => {
        const exportData = rows.map((row, index) => ({
          "S.No": index + 1,
          "Name": row.original.RName,
          "Mobile": row.original.RMob1,
          "Address": row.original.RAddress,
          "CO1 Name": row.original.C1Name,
          "CO1 Mobile": row.original.C1Mob,
          "Sending Date": row.original.SendingDate,
          "Remarks": row.original.ERemark,
        
        }));
    
        if (format === 'csv') {
          const csv = generateCsv(csvConfig)(exportData);
          download(csvConfig)(csv);
        } else if (format === 'pdf') {
          const doc = new jsPDF();
          const tableData = exportData.map(row => Object.values(row));
          const tableHeaders = ["S.No", "Name", "Mobile", "Address", "CO1 Name", "CO1 Mobile", "Sending Date" , "Remarks"];
          autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
          });
          doc.save('OutgoingForm.pdf');
        }
      };


    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });
    
    const table = useMaterialReactTable({
        columns,
        data: OFDetails,
        // enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiTableFooterCellProps: {
            sx: {
                fontWeight: 'bold',
                color:'black',
                fontSize: '15px'
            },
        },
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
            <div className="container py-4 pl-6 text-black">
                <div className='w-full h-full my-1 container-fluid'>
                    <FormsAdminInfo />
                </div>

                <h1 className="text-3xl font-bold my-4">Outgoing Form Info</h1>
                <Form onSubmit={handleSubmit} className="OutgoingForms-form">
                    <Row className="mb-3">
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>Mobile Number<sup className='text-red-500'>*</sup></Form.Label>
                                <Typeahead
                                    id="VMob1"
                                    selected={formData.VMob1 ? [{ VMob1: formData.VMob1 }] : []}
                                    name="VMob1"
                                    onInputChange={(value) => {fetchSuggestedMobiles(value, setSuggestedMobiles);
                                        const error = validateFormsAdmin("VMob1", value);
                                        setErrors((prevErrors) => ({ ...prevErrors, VMob1: error }));
                                    }}
                                    onChange={(selected) => {
                                        if (selected.length > 0) {
                                            const [choice] = selected;
                                            setFormData(prevData => ({
                                                ...prevData,
                                                VMob1: choice.VMob1,
                                                VMob2: choice.VMob2,
                                                VEName: choice.VEName,
                                                VHName: choice.VHName,
                                                VEAddress: choice.VEAddress,
                                                VHAddress: choice.VHAddress,
                                            }));
                                            const error = validateFormsAdmin("VMob1", choice.VMob1);
                                            setErrors((prevErrors) => ({ ...prevErrors, VMob1: error }));
                                        }
                                    }}
                                    options={suggestedMobiles}
                                    placeholder="Mobile Number"
                                    labelKey="VMob1"
                                    renderMenuItemChildren={(option) => (
                                        <div>
                                            {option.VMob1} - {option.VEName}
                                        </div>
                                    )}
                                />
                                {errors.VMob1 && <div className="text-danger">{errors.VMob1}</div>}
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>Name (English) <sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text"
                                    placeholder="Name (English)"
                                    id="VEName"
                                    name="VEName"
                                    value={formData.VEName}
                                    onChange={handleChange}
                                />
                                {errors.VEName && <div className="text-danger">{errors.VEName}</div>}
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>Name (Hindi) <sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text"
                                    placeholder="Name (Hindi)"
                                    id="VHName" name="VHName"
                                    value={formData.VHName}
                                    onChange={handleChange} />
                            </Form.Group>
                            {errors.VHName && <div className="text-danger">{errors.VHName}</div>}
                        </div>
                    </Row>

                    <Row className="mb-3">
                        <div className="col-md-6 mb-3">
                            <Form.Group>
                                <Form.Label>Address (English)<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text"
                                    placeholder="Address (English)"
                                    id="VEAddress"
                                    name="VEAddress"
                                    value={formData.VEAddress}
                                    onChange={handleChange}
                                />
                                {errors.VEAddress && <div className="text-danger">{errors.VEAddress}</div>}
                            </Form.Group>
                        </div>
                        <div className="col-md-6 mb-3">
                            <Form.Group>
                                <Form.Label>Address (Hindi)<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text"
                                    placeholder="Address (Hindi)"
                                    id="VHAddress"
                                    name="VHAddress"
                                    value={formData.VHAddress}
                                    onChange={handleChange} />
                                {errors.VHAddress && <div className="text-danger">{errors.VHAddress}</div>}
                            </Form.Group>
                        </div>
                    </Row>
                    <div className="row mb-3">
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>Care Of Mobile</Form.Label>
                                <Typeahead
                                    id="CMob1"
                                    name="CMob1"
                                    selected={formData.CMob1 ? [{ VMob1: formData.VMob1 }] : []}
                                    onInputChange={(value) => {
                                        fetchSuggestedMobiles(value, setSuggestedCareOfMobiles);
                                        const error = validateFormsAdmin("CMob1", value);
                                        setErrors((prevErrors) => ({ ...prevErrors, CMob1: error }));
                                    }}
                                    onChange={(selected) => {
                                        if (selected.length > 0) {
                                            const [choice] = selected;
                                            setFormData(prevData => ({
                                                ...prevData,
                                                CMob1: choice.VMob1,
                                                CEName: choice.VEName,
                                                CHName: choice.VHName,
                                            }));
                                            const error = validateFormsAdmin("CMob1", choice.VMob1);
                                            setErrors((prevErrors) => ({ ...prevErrors, CMob1: error }));
                                        }
                                    }}
                                    options={suggestedCareOfMobiles}
                                    placeholder="Mobile Number"
                                    labelKey="VMob1"
                                    renderMenuItemChildren={(option) => (
                                        <div>
                                            {option.VMob1} - {option.VEName}
                                        </div>
                                    )}
                                />
                                {errors.CMob1 && <div className="text-danger">{errors.CMob1}</div>}
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>Careof (English)</Form.Label>
                                <Form.Control type="text"
                                    placeholder="Careof (English)"
                                    id="CEName"
                                    name="CEName" value={formData.CEName} onChange={handleChange} />
                                {errors.CEName && <div className="text-danger">{errors.CEName}</div>}
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>Careof (Hindi)</Form.Label>
                                <Form.Control type="text" placeholder="Careof (Hindi)" id="CHName" name="CHName" value={formData.CHName} onChange={handleChange} />
                            </Form.Group>
                            {errors.CHName && <div className="text-danger">{errors.CHName}</div>}
                        </div>
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>No. of Forms<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="number"
                                    placeholder="No. of Forms"
                                    id="NoOfForms"
                                    name="NoOfForms" value={formData.NoOfForms} onChange={handleChange} />
                                {errors.NoOfForms && <div className="text-danger">{errors.NoOfForms}</div>}
                            </Form.Group>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>Sending Date:<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="date" placeholder="Sending Date" id="SendingDate" name="SendingDate" value={formData.SendingDate} onChange={handleChange} />
                            </Form.Group>
                        </div>
                        <div className="col-md-9 mb-3">
                            <Form.Group>
                                <Form.Label>Remarks</Form.Label>
                                <Form.Control type="text" placeholder="Remarks" id="ERemarks" name="ERemarks" value={formData.ERemarks} onChange={handleChange} />
                            </Form.Group>
                        </div>
                    </div>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>

                <hr className="my-4" />
                <h4 className="container mt-3 text-xl font-bold mb-3">OutgoingForms List</h4>
              

                    <MaterialReactTable table={table} />
                </div>
            
        </main>
    );
}

export default OutgoingForms;
