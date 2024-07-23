import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import Papa from 'papaparse';


const SendSMSForm = () => {
    const [WBOptions, setWBOptions] = useState([]);
    const [formData, setFormData] = useState({
        WBId: '',
        source: 'Database',
        Total_mobile_numbers: '',
        total_records: '',
        csvFile: null,
        exMobile: '',
        exPerson: ''
    });
    const [csvData, setCsvData] = useState(null);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApply = async (e) => {
        try {
            const response = await fetch('/api/v1/qualityStaff/wardwiseVoterContact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ WBId: formData.WBId }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
    
            setFormData(prev => ({
                ...prev,
                Total_mobile_numbers: data[0].Total_mobile_numbers,
                total_records: data[0].total_records 
            }));
            
            toast.success(data.message || 'Voters details fetched successfully');
        } catch (error) {
         
            toast.error(`Error in fetching voters details: ${error.message}`);
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        setFormData(prev => ({ ...prev, csvFile: file }));
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    setCsvData(result.data);
                    // You might want to update exMobile and exPerson here based on the CSV data
                },
                header: true,
            });
        }
        console.log(csvData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/v1/qualityStaff/sendSMS', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({WBId: formData.WBId}),
            });

            const data = await response.json();
            // setFormData(prev => ({ ...prev, }));
            if (response.ok) {
                toast.success(data.message);
            } else {
                toast.error(data.error || 'Error sending SMS');
            }
        } catch (error) {
            toast.error('Error sending SMS');
        }
    };

    return (
        <main className="bg-gray-100">
            <ToastContainer />
            <div className="container py-4 pl-6 text-black">
                <h1 className="text-2xl font-bold mb-4">Send SMS</h1>
                <Form onSubmit={handleSubmit} className="sms-form">
                    <span>Select source</span>
                    <div className='flex gap-10 my-2' >
                        <Form.Check
                            type="radio"
                            id="wardBlock"
                            name="source"
                            value="wardBlock"
                            label="wardBlock"
                            checked={formData.source === 'wardBlock'}
                            onChange={handleInputChange}
                        />
                        <Form.Check
                            type="radio"
                            id="Externalfile"
                            name="source"
                            value="Externalfile"
                            label="External file (CSV)."
                            checked={formData.source === 'Externalfile'}
                            onChange={handleInputChange}
                        />
                    </div>
                    {formData.source === 'wardBlock' && (
                        <div id="wardBlock-options">
                            <Form.Label>Select WardBlock<sup className="text-red-600">*</sup></Form.Label>
                            <div className='flex gap-10'>
                                <div className="col-md-3 " style={{ zIndex: 10 }}>
                                    <Form.Group>
                                        <Select
                                            id="WBSelect"
                                            name="WBId"
                                            value={WBOptions.find(option => option.value === formData.WBId)}
                                            onChange={option => setFormData(prev => ({ ...prev, WBId: option.value }))}
                                            options={WBOptions}
                                            placeholder="Select WardBlock"
                                        />
                                    </Form.Group>
                                </div>
                                <Button onClick={handleApply} variant="primary" type="button">Apply</Button>
                            </div>

                            <Row className="mb-3">
                              
                                <div className="col-md-3 mt-3">
                                    <Form.Group>
                                        <Form.Label htmlFor="db-voter">Total No. of Voters</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="total_records"
                                            id="db-voter"
                                            placeholder='Total No. of Voters'
                                            value={formData.total_records}
                                            onChange={handleInputChange}
                                            readOnly
                                        />
                                    </Form.Group>
                                </div >

                                <div className="col-md-3 mt-3">
                                    <Form.Group>
                                        <Form.Label htmlFor="db-mobile">Total Mobile Found</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Total_mobile_numbers"
                                            id="db-mobile"
                                            placeholder='Total Mobile Found'
                                            value={formData.Total_mobile_numbers}
                                            onChange={handleInputChange}
                                            readOnly
                                        />
                                    </Form.Group>
                                </div>
                            </Row>
                        </div>
                    )}

                    {formData.source === 'Externalfile' && (

                        <div id="externalfile-options">
                            <div className="col-md-3 mb-3">
                                <Form.Group>
                                    <Form.Label htmlFor="csv-upload">Import CSV File</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="csvFile"
                                        id="csv-upload"
                                        accept=".csv"
                                        onChange={handleFileUpload}
                                    />
                                </Form.Group>
                            </div>
                            <Row className="mb-3">
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label htmlFor="ex-mobile">Total Mobile Found</Form.Label>
                                        <Form.Control
                                            type='text'
                                            name="exMobile"
                                            id="ex-mobile"
                                            placeholder='Total Mobile Found'
                                            value={formData.exMobile}
                                            onChange={handleInputChange}
                                            readOnly
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label htmlFor="ex-person">Total Person</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="exPerson"
                                            id="ex-person"
                                            placeholder='Total person'
                                            value={formData.exPerson}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </div>

                            </Row>
                        </div>
                    )}

                    <Button variant="primary" type="submit">Send SMS</Button>
                </Form>
                <hr className="my-4" />
            </div >
        </main >
    );
};

export default SendSMSForm;