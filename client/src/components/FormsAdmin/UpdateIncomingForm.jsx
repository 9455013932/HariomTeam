import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { Box } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import FormsAdminInfo from './FormsAdminInfo.jsx';

function UpdateIncomingForm() {

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
        TotalForms: '',
        PacketNo: '',
        ReceivedDate: today,
        ERemarks: '',
        COList: [{
            VMob1: '',
            VEName: '',
            VHName: '',
            NoOfFormsKN: 0,
            NoOfFormsKD: 0,
            NoOfFormsU: 0,
        }]
    });

    const [suggestedMobiles, setSuggestedMobiles] = useState([]);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1)
    const [careOfSuggestedMobiles, setCareOfSuggestedMobiles] = useState([]); // Track suggestions for Care Of
    const [selectedCareOfIndex, setSelectedCareOfIndex] = useState(-1); // Track selected suggestion index for Care Of

    const mobileInputRef = useRef(null);



    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedOptionIndex(prevIndex => Math.max(prevIndex - 1, 0));
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setSelectedOptionIndex(prevIndex => Math.min(prevIndex + 1, suggestedMobiles.length - 1));
            } else if ((e.key === 'Enter' || e.key === 'Tab') && selectedIndex >= 0) {
                e.preventDefault();
                handleMobileNumberSelect(suggestedMobiles[selectedIndex].VMob1);
            }
        };

        if (mobileInputRef.current) {
            mobileInputRef.current.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (mobileInputRef.current) {
                mobileInputRef.current.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [suggestedMobiles, selectedOptionIndex]);

    const fetchSuggestedMobiles = async (input) => {
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
            setSuggestedMobiles(data);
        } catch (error) {
            console.error('Error fetching suggested mobile numbers:', error);
        }
    };

    const handleMobileNumberChange = (e) => {
        const { value } = e.target;
        setFormData({ ...formData, VMob1: value });
        fetchSuggestedMobiles(value);
    };

    const handleMobileNumberSelect = (selectedMobile) => {
        const selectedUser = suggestedMobiles.find(user => user.VMob1 === selectedMobile);
        if (selectedUser) {
            setFormData({
                ...formData,
                VMob1: selectedUser.VMob1,
                VMob2: selectedUser.VMob2,
                VEName: selectedUser.VEName,
                VHName: selectedUser.VHName,
                VEAddress: selectedUser.VEAddress,
                VHAddress: selectedUser.VHAddress
            });
        }
        setSuggestedMobiles([]);
    };

    const handleCareOfMobileNumberChange = (e, index) => {
        const { value } = e.target;
        const updatedCOList = [...formData.COList];
        updatedCOList[index].VMob1 = value;
        setFormData({ ...formData, COList: updatedCOList });
        fetchCareOfSuggestedMobiles(value, index);
    };

    const fetchCareOfSuggestedMobiles = async (input, index) => {
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
            const newSuggestedMobiles = [...careOfSuggestedMobiles];
            newSuggestedMobiles[index] = data;
            setCareOfSuggestedMobiles(newSuggestedMobiles);
        } catch (error) {
            console.error('Error fetching suggested mobile numbers:', error);
        }
    };

    const handleCareOfMobileNumberSelect = (selectedMobile, index) => {
        const selectedUser = careOfSuggestedMobiles[index].find(user => user.VMob1 === selectedMobile);
        if (selectedUser) {
            const updatedCOList = [...formData.COList];
            updatedCOList[index] = {
                ...updatedCOList[index],
                VMob1: selectedUser.VMob1,
                VEName: selectedUser.VEName,
                VHName: selectedUser.VHName
            };
            setFormData({ ...formData, COList: updatedCOList });
        }
        const newSuggestedMobiles = [...careOfSuggestedMobiles];
        newSuggestedMobiles[index] = [];
        setCareOfSuggestedMobiles(newSuggestedMobiles);
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleAddCareOf = () => {
        if (formData.COList.length < 5) {
            setFormData({
                ...formData,
                COList: [...formData.COList, { VMob1: '', VEName: '', VHName: '', NoOfFormsKN: '', NoOfFormsKD: '', NoOfFormsU: '', }]
            });
        }
    };

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
        } else if (formData.COList.length < 5) {
            updatedCOList.splice(index + 1, 0, {
                VMob1: '', VEName: '', VHName: '', NoOfFormsKN: '',
                NoOfFormsKD: '',
                NoOfFormsU: '',
            });
        }
        setFormData({ ...formData, COList: updatedCOList });
    };


    const calculateTotalForms = () => {
        let totalForms = 0;
        formData.COList.forEach(co => {
            totalForms += Number(co.NoOfFormsKN) + Number(co.NoOfFormsKD) + Number(co.NoOfFormsU);
        });
        return totalForms;
    };



    return (
        <main className="bg-gray-100">
            <div className="container py-4 pl-6 text-black">
                


                <h1 className="text-3xl font-bold my-4">Incoming Form Info</h1>
                <Form className="IncomingForms-form">
                <div className="col-md-2 mb-3">
                            <Form.Group >
                                <Form.Label>Packet No.<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text" placeholder="Packet No." name="PacketNo" value={formData.PacketNo} onChange={handleChange} required />
                            </Form.Group>
                        </div>
                    
                    
                    <Row className="mb-3">

                        <div className="col-md-3 mb-3">
                            <Form.Group controlId="VMob1">
                                <Form.Label>Mobile Number 1</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Mobile Number 1"
                                    value={formData.VMob1}
                                    onChange={handleMobileNumberChange}
                                    ref={mobileInputRef}
                                    className="border p-2 rounded-md w-full"
                                />
                                {suggestedMobiles.length > 0 && (
                                    <ul className="suggestions max-h-48 overflow-y-auto border border-gray-300 rounded-md mt-2">
                                        {suggestedMobiles.map((mobile, index) => (
                                            <li
                                                key={mobile.VMob1}
                                                className={`p-2 cursor-pointer hover:bg-gray-400 ${index === selectedOptionIndex ? 'bg-gray-400' : ''}`}
                                                onClick={() => handleMobileNumberSelect(mobile.VMob1)}
                                            >
                                                {mobile.VMob1} - {mobile.VEName}
                                            </li>
                                        ))}
                                    </ul>

                                )}
                            </Form.Group>
                        </div>


                        <div className="col-md-3 mb-3">
                            <Form.Group >
                                <Form.Label>Mobile No. 2</Form.Label>
                                <Form.Control type="tel" placeholder="Mobile No. 2" name="VMob2" value={formData.VMob2} onChange={handleChange} />
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Form.Group >
                                <Form.Label>Name (English)<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text" placeholder="Name (English)" name="VEName" value={formData.VEName} onChange={handleChange} required />
                            </Form.Group>
                        </div>
                        <div className="col-md-3 mb-3">
                            <Form.Group >
                                <Form.Label>Name (Hindi) <sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text" placeholder="Name (Hindi)" name="VHName" value={formData.VHName} onChange={handleChange} />
                            </Form.Group>
                        </div>
                    </Row>

                    <Row className="mb-3">
                        <div className="col-md-6 mb-3">
                            <Form.Group >
                                <Form.Label>Address (English)<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text" placeholder="Address (English)" name="VEAddress" value={formData.VEAddress} onChange={handleChange} required />
                            </Form.Group>
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Group >
                                <Form.Label>Address (Hindi)<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="text" placeholder="Address (Hindi)" name="VHAddress" value={formData.VHAddress} onChange={handleChange} />
                            </Form.Group>
                        </div>
                    </Row>

                    <Row className="mb-3">
                    <div className="col-md-6 mb-3">
                            <Form.Group >
                                <Form.Label>Remarks</Form.Label>
                                <Form.Control type="text" placeholder="Remarks" name="ERemarks" value={formData.ERemarks} onChange={handleChange} />
                            </Form.Group>
                        </div>

                        <div className="col-md-2 mb-3">
                            <Form.Group >
                                <Form.Label>Received Date :<sup className='text-red-500'>*</sup></Form.Label>
                                <Form.Control type="date" placeholder="" name="ReceivedDate" value={formData.ReceivedDate} onChange={handleChange} required />
                            </Form.Group>
                        </div>

                        <div className="col-md-2 mb-3">
                            <Form.Group>
                                <Form.Label>Total Forms</Form.Label>
                                <Form.Control type="number" name="TotalForms" value={formData.TotalForms = calculateTotalForms()} onChange={handleChange} readOnly />
                            </Form.Group>
                        </div>

                       
                    </Row>

                    {formData.COList.map((e, index) => (
                        <div className="row mb-3" key={index}>
                            <Row className="mb-3">
                                <div className="col-md-3 mb-3">
                                    <Form.Group controlId={`VMob1_${index}`}>
                                        <Form.Label>Care of Mobile No.{index + 1}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder={`Care of Mobile No ${index + 1}`}
                                            value={formData.COList[index].VMob1}
                                            onChange={(e) => handleCareOfMobileNumberChange(e, index)}
                                            className="border p-2 rounded-md w-full"
                                            required
                                        />
                                        {careOfSuggestedMobiles[index]?.length > 0 && (
                                            <ul className="suggestions max-h-48 overflow-y-auto border border-gray-300 rounded-md mt-2">
                                                {careOfSuggestedMobiles[index].map((mobile) => (
                                                    <li
                                                        key={mobile.VMob1}
                                                        className={`p-2 cursor-pointer hover:bg-gray-400 ${index === selectedCareOfIndex ? 'bg-gray-400' : ''}`}
                                                        onClick={() => handleCareOfMobileNumberSelect(mobile.VMob1, index)}
                                                    >
                                                        {mobile.VMob1} - {mobile.VEName}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
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
                                            required
                                            
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
                            </Row>




                            <Row className="mb-3">
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>No. of Forms (Kanpur) {index + 1}<sup className='text-red-500'>*</sup></Form.Label>
                                        <Form.Control
                                                 type="number"
                                                 placeholder={`No. of Forms (Kanpur) ${index + 1}`} 
                                                 name="NoOfFormsKN" 
                                                 value={ e.NoOfFormsKN} 
                                                 onChange={(event) => handleCareOfChange(event, index)} 
                                                 />
                                    </Form.Group>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>No. of Forms (Dehat)<sup className='text-red-500'>*</sup></Form.Label>
                                        <Form.Control 
                                                    type="number" 
                                                    placeholder="No. of Forms" 
                                                    name="NoOfFormsKD" 
                                                    value={e.NoOfFormsKD} 
                                                    onChange={(event) => handleCareOfChange(event, index)} 
                                                     />
                                    </Form.Group>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Form.Group>
                                        <Form.Label>No. of Forms (Unnao)<sup className='text-red-500'>*</sup></Form.Label>
                                        <Form.Control type="number" 
                                                placeholder="No. of Forms" 
                                                name="NoOfFormsU" 
                                                value={e.NoOfFormsU} 
                                                onChange={(event) => handleCareOfChange(event, index)} 
                                                 />
                                    </Form.Group>
                                </div>

                                <div className="col-md-2 mb-3">
                                    <Form.Group>
                                        <Form.Label>Total Forms<sup className='text-red-500'>*</sup></Form.Label>
                                        <Form.Control type="number" placeholder="Total Forms" name="" value={Number(e.NoOfFormsKN) + Number(e.NoOfFormsKD) + Number(e.NoOfFormsU)} readOnly />
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
                        Update
                    </Button>
                </Form>

                
                
            </div>
        </main>
    );
}

export default UpdateIncomingForm;


