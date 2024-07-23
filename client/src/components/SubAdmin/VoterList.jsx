import React, { useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Link } from 'react-router-dom';

function VoterList() {
    const [votersDetails, setVotersDetails] = useState([]);
    const [formData, setFormData] = useState({ WBId: undefined });
    const [WBOptions, setWBOptions] = useState([]);

    useEffect(() => {
        const fetchWBOptions = async () => {
            try {
                const response = await fetch('/api/v1/admin/wardBlockDetails', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error('Failed to fetch wardblock options');

                const data = await response.json();
                if (!data || !Array.isArray(data) || data.length === 0) throw new Error('Empty or invalid wardblock options data');

                const options = data.map(wb => ({ value: wb.Id, label: `${wb.WardNo} - ${wb.EWardBlock}` }));
                setWBOptions(options);

            } catch (error) {
                toast.error(`Error fetching wardblock options: ${error.message}`);
            }
        };

        fetchWBOptions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await fetch("/api/v1/subAdmin/voterList", {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });

            if (result.ok) {
                const data = await result.json();
                if (!data || !Array.isArray(data) || data.length === 0) throw new Error('Empty or invalid voter list data');

                setVotersDetails(data);
                toast.success("Voter list fetched successfully.");
            } else {
                toast.error(`Error in fetching details: ${result.statusText}`);
            }
        } catch (error) {
            toast.error(`Error in fetching: ${error.message}`);
        }
    };

    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user ? user.role : '';

    const columns = useMemo(() => {
        const baseColumns = [
            {
                accessorKey: 'Serial No',
                header: 'S. No.',
                size: 50,
                Cell: ({ row }) => row.index + 1,
            },
            { accessorKey: 'Id', header: 'Id', size: 10 },
            { accessorKey: 'EFName', header: 'Name (English)', size: 20,
                Cell : ({cell}) =>{
                    const {EFName, ELName }= cell.row.original;
                    return `${EFName} ${ELName}`
                },
             },
            { accessorKey: 'HFName', header: 'Name (Hindi)', size: 20,
                Cell : ({cell}) =>{
                    const {HFName, HLName }= cell.row.original;
                    return `${HFName} ${HLName}`
                },
             },
            { accessorKey: 'RType', header: 'Relation', size: 10 },
            { accessorKey: 'ERFName', header: 'Relative Name (English)', size: 20,
                Cell : ({cell}) =>{
                    const {ERFName, ERLName }= cell.row.original;
                    return `${ERFName} ${ERLName}`
                },
             },
            { accessorKey: 'HRFName', header: 'Relative Name (Hindi)', size: 20,
                Cell : ({cell}) =>{
                    const {HRFName, HRLName }= cell.row.original;
                    return `${HRFName} ${HRLName}`
                },
             },
            {
                accessorKey: 'EAreaVillHNo',
                header: 'Address',
                size: 20,
                Cell: ({ cell }) => {
                    const { EAreaVill, HNo } = cell.row.original;
                    return `${HNo} ${EAreaVill}`;
                },
            },
            { accessorKey: 'ECaste', header: 'Caste', size: 20 },
            { accessorKey: 'Qualification', header: 'Qualification', size: 20 },
            { accessorKey: 'Occupation', header: 'Occupation', size: 20 },
            { accessorKey: 'Age', header: 'Age', size: 5 },
            { accessorKey: 'DOB', header: 'DOB', size: 10 },
            { accessorKey: 'Sex', header: 'Gender', size: 10 },
            { accessorKey: 'MNo', header: 'Mobile', size: 10 },
            { accessorKey: 'AadharNo', header: 'Aadhar', size: 12 },
            { accessorKey: 'VIdNo', header: 'VoterId', size: 20 },
            { accessorKey: 'GCYear', header: 'Grd.Year', size: 4 },
            {
                accessorKey: 'Image',
                header: 'Photo',
                size: 20,
                Cell: ({ cell }) => {
                    const image = cell.getValue();
                    if (!image) return 'N/A';
                    const imageUrl = `http://localhost:3000/public/photo/${image}`;
                    return <img src={imageUrl} alt="voter" style={{ width: '50px', height: '50px' }} />;
                },
            },
            {
                accessorKey: 'Degree',
                header: 'Degree',
                size: 20,
                Cell: ({ cell }) => {
                    const degreeUrl = cell.getValue();
                    if (!degreeUrl) return 'N/A';
                    const imageUrl = `http://localhost:3000/public/Degree/${degreeUrl}`;
                    return <img src={imageUrl} alt="degree" style={{ width: '50px', height: '50px' }} />;
                },
            },
            {
                accessorKey: 'IdProof',
                header: 'Id',
                size: 20,
                Cell: ({ cell }) => {
                    const idProofUrl = cell.getValue();
                    if (!idProofUrl) return 'N/A';
                    const imageUrl = `http://localhost:3000/public/IdProof/${idProofUrl}`;
                    return <img src={imageUrl} alt="id proof" style={{ width: '50px', height: '50px' }} />;
                },
            },
        ];

        if (userRole === 'QC Staff') {
            baseColumns.unshift(
                {
                    header: 'Edit',
                    size: 10,
                    Cell: ({ row }) => (
                        <Button variant="primary" className="Edit">
                            <Link to={{ pathname: "/edit", search: `?content=${row.original.Id}` }}>
                                Edit
                            </Link>
                        </Button>
                    ),
                },
                {
                    header: 'Delete',
                    size: 10,
                    Cell: ({ row }) => (
                        <Button variant="danger" className="Edit">
                            <Link to={{ pathname: "/delete", search: `?content=${row.original.Id}` }}>
                                delete
                            </Link>
                        </Button>
                    ),
                }          
            
            );
        }

        return baseColumns;
    }, [userRole]);

    const table = useMaterialReactTable({ columns, data: votersDetails });

    return (
        <main className="bg-gray-100">
            <ToastContainer />
            <div className="container py-4 pl-6 text-black">
                <h1 className="text-2xl font-bold mb-4">Voter Details</h1>
                <Form onSubmit={handleSubmit} className="voter-form">
                    <Row className="mb-3">
                        <div className="col-md-3 mb-3" style={{ zIndex: 10 }}>
                            <Form.Group>
                                <Form.Label>Select WardBlock<sup className="text-red-600">*</sup></Form.Label>
                                <Select
                                    id="WBSelect"
                                    name="WBId"
                                    value={WBOptions.find(option => option.value === formData.WBId)}
                                    onChange={option => setFormData(prevFormData => ({ ...prevFormData, WBId: option.value }))}
                                    options={WBOptions}
                                    placeholder="Select WardBlock"
                                />
                            </Form.Group>
                        </div>
                    </Row>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
                <hr className="my-4" />
                <h4 className="container mt-3 text-xl font-bold mb-3">Voter List</h4>
                <div className="overflow-x-auto" style={{ zIndex: -1 }}>
                    <MaterialReactTable table={table} />
                </div>
            </div>
        </main>
    );
}

export default VoterList;
