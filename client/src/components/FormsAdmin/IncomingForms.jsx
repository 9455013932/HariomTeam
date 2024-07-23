import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Form, Row } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Box, Button as MUIButton } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import FormsAdminInfo from './FormsAdminInfo.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateFormsAdmin } from '../../Validation/formsAdminValidation.js';

function IncomingForms() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const content = searchParams.get('content');

    const formatDate = (date) => {
        const d = new Date(date);
        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        const day = `${d.getDate()}`.padStart(2, '0');
        const year = d.getFullYear();
        return [year, month, day].join('-');
    };

    const today = formatDate(new Date());

    const [IFDetails, setIFDetails] = useState([]);
    const [formData, setFormData] = useState({

        VMob1: '',
        VMob2: '',
        VEName: '',
        VHName: '',
        VEAddress: '',
        VHAddress: '',
        NoOfFormsKN: 0,
        NoOfFormsKD: 0,
        NoOfFormsU: 0,
        PacketNo: content || '',
        ReceivedDate: today,
        ERemarks: '',
        COList: [{
            VMob1: '',
            VEName: '',
            VHName: '',
        }]
    });
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
        } catch (error) {
            console.error('Error fetching suggested mobile numbers:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/v1/formsAdmin/incomFormDetails', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch IncomingForms details');
                }
                const data = await response.json();
                if (!data || !Array.isArray(data) || data.length === 0) {
                    throw new Error('Empty or invalid IncomingForms details data');
                }
                setIFDetails(data);

                if (content) {
                    const IF = data.find(item => item.PacketNo === content);
                    if (IF) {
                        setFormData({
                            VMob1: IF.RMob1,
                            VMob2: IF.RMob2 || '',
                            VEName: IF.RName,
                            VHName: IF.RHName,
                            VEAddress: IF.RAddress || '',
                            VHAddress: IF.RHAddress || '',
                            NoOfFormsKN: IF.NFormsKN || 0,
                            NoOfFormsKD: IF.NFormsKd || 0,
                            NoOfFormsU: IF.NFormsU || 0,
                            PacketNo: IF.PacketNo,
                            ReceivedDate: IF.ReceivedDate.split('T')[0],
                            ERemarks: IF.ERemarks || '',
                            COList: [
                                {
                                    VMob1: IF.C1Mob,
                                    VEName: IF.C1Name,
                                    VHName: IF.C1HName,
                                },
                                IF.C2Name ? {
                                    VMob1: IF.C2Mob,
                                    VEName: IF.C2Name,
                                    VHName: IF.C2HName,
                                } : null,
                                IF.C3Name ? {
                                    VMob1: IF.C3Mob,
                                    VEName: IF.C3Name,
                                    VHName: IF.C3HName,
                                } : null
                            ].filter(co => co !== null)
                        });
                    } else {
                        toast.error(`IncomingForm with PacketNo ${content} not found`);
                    }
                }
            } catch (error) {
                toast.error('Error fetching IncomingForms data:', error);
            }
        };

        fetchData();
    }, [content]);

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
            const result = await fetch("/api/v1/formsAdmin/AddIncomForm", {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (result.ok) {
                // window.location.reload();
                setFormData({

                    VMob1: '',
                    VMob2: '',
                    VEName: '',
                    VHName: '',
                    VEAddress: '',
                    VHAddress: '',
                    NoOfFormsKN: 0,
                    NoOfFormsKD: 0,
                    NoOfFormsU: 0,
                    PacketNo: content || '',
                    ReceivedDate: today,
                    ERemarks: '',
                    COList: [{
                        VMob1: '',
                        VEName: '',
                        VHName: '',
                    }]
                }
                )

                toast.success("IncomingForms Added Successfully.");
            } else {
                toast.error("Error in Adding IncomingForms:", result.statusText);
            }
        } catch (error) {
            toast.error("Error in Adding IncomingForms:", error.message);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const result = await fetch("/api/v1/formsAdmin/UpdateIncomForm", {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (result.ok) {
                toast.success("incomingForms Updated successfully.");
                setTimeout(() => {
                    window.location.href = '/incomingForms';
                }, 100);
            } else {
                toast.error("Error in Updating incomingForms:", result.statusText);
            }
        } catch (error) {
            toast.error("Error in updating :", error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
            accessorKey: 'Action',
            header: 'Action',
            size: 1,
            Cell: ({ row }) => (
                <>
                    <Button variant="primary" className="changepassword">
                        <Link
                            to={{ pathname: "/incomingForms", search: `?content=${row.original.PacketNo}` }}
                        >
                            Edit
                        </Link>
                    </Button>

                </>
            ),
        },
        {
            accessorKey: 'PacketNo',
            header: 'PacketNo',
            size: 5,
        },

        {
            accessorKey: 'RName',
            header: 'Name ',
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
            accessorKey: 'NFormsKN',
            header: 'InForm Kanpur',
            size: 5,
            Footer: () => calculateColumnTotals('NFormsKN')
        },
        {
            accessorKey: 'NFormsKd',
            header: 'InForm Dehat',
            size: 5,
            Footer: () => calculateColumnTotals('NFormsKd')
        },
        {
            accessorKey: 'NFormsU',
            header: 'InForm Unnao',
            size: 5,
            Footer: () => calculateColumnTotals('NFormsU')
        },
        {
            accessorKey: 'TotalForms',
            header: 'Total Forms',
            size: 4,
            Footer: () => calculateColumnTotals('TotalForms')
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
            accessorKey: 'C2Name',
            header: 'CO2 Name',
            size: 15,
        },
        {
            accessorKey: 'C2Mob',
            header: 'CO2 Mobile',
            size: 10,
        },
        {
            accessorKey: 'C3Name',
            header: 'CO3 Name',
            size: 15,
        },
        {
            accessorKey: 'C3Mob',
            header: 'CO3 Mobile',
            size: 10,
        },
        {
            accessorKey: 'ReceivedDate',
            header: 'Received Date',
            size: 8,
        },
        {
            accessorKey: 'ERemarks',
            header: 'Remarks',
            size: 25,
        },
    ], [IFDetails]);


    const handleExport = (rows, format) => {
        const exportData = rows.map((row, index) => ({
            "S.No": index + 1,
            "PacketNo": row.original.PacketNo,
            "Name": row.original.RName,
            "Mobile": row.original.RMob1,
            "Address": row.original.RAddress,
            "InForm Kanpur": row.original.NFormsKN,
            "InForm Dehat": row.original.NFormsKd,
            "InForm Unnao": row.original.NFormsU,
            "TotalForms": row.original.TotalForms,
            "CO1 Name": row.original.C1Name,
            "CO1 Mobile": row.original.C1Mob,
            "CO2 Name": row.original.C2Name,
            "CO2 Mobile": row.original.C2Mob,
            "CO3 Name": row.original.C3Name,
            "CO3 Mobile": row.original.C3Mob,
            "Received Date": row.original.ReceivedDate,
            "Remarks": row.original.ERemark
        }));

        if (format === 'csv') {
            const csv = generateCsv(csvConfig)(exportData);
            download(csvConfig)(csv);
        } else if (format === 'pdf') {
            const doc = new jsPDF('landscape');
            const tableData = exportData.map(row => Object.values(row));
            const tableHeaders = ["S.No", "PacketNo", "Name", "Mobile", "Address", "InForm Kanpur", "InForm Dehat", "InForm Unnao", "TotalForms", "CO1 Name", "CO1 Mobile", "CO2 Name", "CO2 Mobile", "CO3 Name", "CO3 Mobile"];
            autoTable(doc, {
                head: [tableHeaders],
                body: tableData,
            });
            doc.save('IncomingForm.pdf');
        }
    };

    const csvConfig = mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    });

    const table = useMaterialReactTable({
        columns,
        data: IFDetails,
        // enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        muiTableFooterCellProps: {
            sx: {
                fontWeight: 'bold',
                color: 'black',
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


    const handleCareOfChange = (e, index) => {
        const { name, value } = e.target;
        const updatedCOList = [...formData.COList];
        updatedCOList[index][name] = value;
        setFormData({ ...formData, COList: updatedCOList });
    };

    const handleCareOfCheck = (index, event) => {
        const checked = event.target.checked;
        let updatedCOList = [...formData.COList];
        if (!checked) {
            updatedCOList.splice(index, 1); // Remove the unchecked item
        } else if (formData.COList.length < 3) {
            updatedCOList.splice(index + 1, 0, {
                VMob1: '', VEName: '', VHName: ''
            });
        }
        setFormData({ ...formData, COList: updatedCOList });
    };

    const calculateColumnTotals = (key) => {
        return IFDetails.reduce((sum, row) => sum + (Number(row[key]) || 0), 0);
    };

    return (
        <main className="bg-gray-100">
            <div className="container py-4 pl-6 text-black">
                <div className='w-full h-full my-1 container-fluid'>
                    <FormsAdminInfo />
                </div>

                <h1 className="text-3xl font-bold my-4">Incoming Form Info</h1>
                <Form onSubmit={content ? handleEdit : handleSubmit} className="IncomingForms-form">
                    <Row className="mb-3">
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>Mobile No. 1<sup className='text-red-500'>*</sup></Form.Label>
                                <Typeahead
                                    id="VMob1"
                                    selected={formData.VMob1 ? [{ VMob1: formData.VMob1 }] : []}
                                    onInputChange={(inputValue) => {
                                        const error = validateFormsAdmin("VMob1", inputValue);
                                        setErrors((prevErrors) => ({ ...prevErrors, VMob1: error }));
                                        setFormData((prevDetails) => ({
                                            ...prevDetails,
                                            VMob1: inputValue,
                                        }));
                                        fetchSuggestedMobiles(inputValue, setSuggestedMobiles)
                                    }}

                                    onChange={(selected) => {
                                        if (selected.length > 0) {
                                            const [choice] = selected;
                                            setFormData(prevData => ({
                                                ...prevData,
                                                VMob1: choice.VMob1,
                                                VMob2: choice.VMob2 || '',
                                                VEName: choice.VEName,
                                                VHName: choice.VHName,
                                                VEAddress: choice.VEAddress || '',
                                                VHAddress: choice.VHAddress || '',
                                            }));
                                            const error = validateFormsAdmin("VMob1", choice.VMob1);
                                            setErrors((prevErrors) => ({ ...prevErrors, VMob1: error }));
                                        } else {
                                            setFormData((prevDetails) => ({
                                                ...prevDetails,
                                                EAreaVill: '', // Reset if cleared
                                            }));
                                        }
                                    }}
                                    options={suggestedMobiles}
                                    placeholder="Mobile Number 1"
                                    labelKey="VMob1"
                                    defaultInputValue={formData.VMob1}
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
                            <Form.Group >
                                <Form.Label>Mobile No. 2</Form.Label>
                                <Form.Control type="tel" placeholder="Mobile No. 2" name="VMob2" value={formData.VMob2} onChange={handleChange} />
                            {errors.VMob2 && <div className="text-danger">{errors.VMob2}</div>}
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Form.Group >
                                <Form.Label>Name (English)<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text" placeholder="Name (English)" name="VEName" value={formData.VEName} onChange={handleChange} />
                                {errors.VEName && <div className="text-danger">{errors.VEName}</div>}
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Form.Group >
                                <Form.Label>Name (Hindi) <sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text" placeholder="Name (Hindi)" name="VHName" value={formData.VHName} onChange={handleChange} />
                                {errors.VHName && <div className="text-danger">{errors.VHName}</div>}
                            </Form.Group>
                        </div>
                    </Row>

                    <Row className="mb-3">
                        <div className="col-md-5 mb-3">
                            <Form.Group >
                                <Form.Label>Address (English)<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text" placeholder="Address (English)" name="VEAddress" value={formData.VEAddress} onChange={handleChange} />
                                {errors.VEAddress && <div className="text-danger">{errors.VEAddress}</div>}
                            </Form.Group>
                        </div>

                        <div className="col-md-5 mb-3">
                            <Form.Group >
                                <Form.Label>Address (Hindi)<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text" placeholder="Address (Hindi)" name="VHAddress"
                                    value={formData.VHAddress}
                                    onChange={handleChange} />
                                       {errors.VHAddress && <div className="text-danger">{errors.VHAddress}</div>}
                            </Form.Group>
                        </div>
                    </Row>


                    <Row className="mb-3">
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>No. of Forms (Kanpur)</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder={`No. of Forms (Kanpur)`}
                                    name="NoOfFormsKN"
                                    value={formData.NoOfFormsKN}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>No. of Forms (Dehat)</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="No. of Forms (Dehat)"
                                    name="NoOfFormsKD"
                                    value={formData.NoOfFormsKD}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Form.Group>
                                <Form.Label>No. of Forms (Unnao)</Form.Label>
                                <Form.Control type="number"
                                    placeholder="No. of Forms (Unnao)"
                                    name="NoOfFormsU"
                                    value={formData.NoOfFormsU}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-2 mb-3">
                            <Form.Group>
                                <Form.Label>Total Forms<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="number" placeholder="Total Forms" name="" value={Number(formData.NoOfFormsKN) + Number(formData.NoOfFormsKD) + Number(formData.NoOfFormsU)} readOnly />
                            </Form.Group>
                        </div>
                    </Row>


                    <Row className="mb-3">
                        <div className="col-md-5 mb-3">
                            <Form.Group >
                                <Form.Label>Remarks</Form.Label>
                                <Form.Control type="text" placeholder="Remarks" name="ERemarks" value={formData.ERemarks} onChange={handleChange} />
                            </Form.Group>
                        </div>

                        <div className="col-md-2 mb-3">
                            <Form.Group >
                                <Form.Label>Packet No.<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text" placeholder="Packet No." name="PacketNo" value={formData.PacketNo} onChange={handleChange} />
                                {errors.PacketNo && <div className="text-danger">{errors.PacketNo}</div>}
                            </Form.Group>
                        </div>

                        <div className="col-md-2 mb-3">
                            <Form.Group >
                                <Form.Label>Received Date :<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="date" placeholder="" name="ReceivedDate" value={formData.ReceivedDate} onChange={handleChange} />
                            </Form.Group>
                        </div>
                    </Row>

                    {formData.COList.map((e, index) => (
                        <div className="row mb-3" key={index}>
                            <Row className="mb-3">
                                <div className="col-md-3 mb-3">
                                    <Form.Group controlId={`COList-${index}-VMob1`}>
                                        <Form.Label>Care Of Mobile {index + 1}</Form.Label>
                                        <Typeahead
                                            id={`COList-${index}-VMob1`}
                                            selected={formData.COList[index].VMob1 ? [{ VMob1: formData.COList[index].VMob1 }] : []}
                                            onInputChange={(inputValue) => {
                                                const error = validateFormsAdmin("CMob1", inputValue);
                                                setErrors((prevErrors) => ({ ...prevErrors, [`VMob1-${index}`]: error }));

                                                const updatedCOList = [...formData.COList];
                                                updatedCOList[index].VMob1 = inputValue;
                                                setFormData((prevDetails) => ({
                                                    ...prevDetails,
                                                    COList: updatedCOList,
                                                }));
                                                fetchSuggestedMobiles(inputValue, setSuggestedCareOfMobiles);
                                            }}
                                            onChange={(selected) => {
                                                const updatedCOList = [...formData.COList];
                                                if (selected.length > 0) {
                                                    const [choice] = selected;
                                                    updatedCOList[index] = {
                                                        ...updatedCOList[index],
                                                        VMob1: choice.VMob1,
                                                        VEName: choice.VEName,
                                                        VHName: choice.VHName,
                                                    };
                                                    setFormData({ ...formData, COList: updatedCOList });
                                                    const error = validateFormsAdmin("CMob1", choice.VMob1);
                                                    setErrors((prevErrors) => ({ ...prevErrors, [`VMob1-${index}`]: error }));
                                                } else {
                                                    updatedCOList[index].VMob1 = '';
                                                    setFormData((prevDetails) => ({
                                                        ...prevDetails,
                                                        COList: updatedCOList,
                                                    }));
                                                }
                                            }}
                                            options={suggestedCareOfMobiles}
                                            placeholder="Search mobile"
                                            labelKey="VMob1"
                                            renderMenuItemChildren={(option) => (
                                                <div>
                                                    {option.VMob1} - {option.VEName}
                                                </div>
                                            )}
                                        />
                                        {errors[`VMob1-${index}`] && <div className="text-danger">{errors[`VMob1-${index}`]}</div>}
                                    </Form.Group>
                                </div>


                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>Care of Name {index + 1} (English)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={`Care of (English) ${index + 1}`}
                                            name="VEName"
                                            value={formData.COList[index].VEName}
                                            onChange={(e) => handleCareOfChange(e, index)}

                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>Care of Name {index + 1} (Hindi)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={`Care of (Hindi) ${index + 1}`}
                                            name="VHName"
                                            value={formData.COList[index].VHName}
                                            onChange={(e) => handleCareOfChange(e, index)}
                                        />
                                    </Form.Group>
                                </div>
                                {index < 2 && (
                                    <div className="col-md-2 mb-3">
                                        <Form.Group>
                                            <Form.Label>Add Care Of {index + 2}<sup className='text-red-500'>*</sup></Form.Label>
                                            <br />
                                            <input
                                                type="checkbox"
                                                className='w-6 h-6'
                                                checked={formData.COList.length > index + 1}
                                                onChange={(event) => handleCareOfCheck(index + 1, event)}
                                            />
                                        </Form.Group>
                                    </div>
                                )}
                            </Row>
                        </div>
                    ))}

                    <Button variant="primary" type="submit">
                        {content ? 'Update' : 'Submit'}
                    </Button>
                </Form>

                <hr className="my-4" />
                <h4 className="container mt-3 text-xl font-bold mb-3">IncomingForms List</h4>
                <div className="overflow-x-auto">

                    <MaterialReactTable table={table} />
                </div>
            </div>
        </main>
    );
}
export default IncomingForms;


