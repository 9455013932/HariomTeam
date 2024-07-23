import React, { useState, useEffect } from 'react';
import { Form, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateVoterDetails } from '../../Validation/voterDetailsValidation';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

function ReferenceDetailsForm({ referenceDetails, setReferenceDetails, errors, setErrors }) {
    const [packetOptions, setPacketOptions] = useState([]);
    const fetchPacketOptions = async (inputValue) => {
        try {
            const response = await fetch('/api/v1/feedingStaff/SearchPacketNo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: inputValue }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch packet options');
            }

            const data = await response.json();
            if (!data || !Array.isArray(data) || data.length === 0) {
                throw new Error('Empty or invalid packet options data');
            }

            const options = data.map(packet => ({ value: packet.PacketNo, label: packet.PacketNo }));
            setPacketOptions(options);
        } catch (error) {
            toast.error(`Error fetching Packet options: ${error.message}`);
        }
    };

    const fetchRefrenceDetails = async (selectedOption) => {
        try {
            const response = await fetch('/api/v1/feedingStaff/ReferenceDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ PKT: selectedOption }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch reference details');
            }

            const data = await response.json();

      

            if (!data || Object.keys(data).length === 0) {
                throw new Error('Empty or invalid reference details data');
            }

            const mappedCOList = [
                { VMob1: data[0].C1Mob || '', VEName: data[0].C1Name || '', VHName: data[0].C1HName || '' },
                { VMob1: data[0].C2Mob || '', VEName: data[0].C2Name || '', VHName: data[0].C2HName || '' },
                { VMob1: data[0].C3Mob || '', VEName: data[0].C3Name || '', VHName: data[0].C3HName || '' },
            ].filter(co => co.VMob1 || co.VEName || co.VHName); 

            setReferenceDetails({
                ...referenceDetails,
                PacketNo: selectedOption,
                IncRefId: data[0].IncRefId || '',
                VMob1: data[0].RMob1 || '',
                VMob2: data[0].RMob2 || '',
                VEName: data[0].RName || '',
                VHName: data[0].RHName || '',
                VEAddress: data[0].RAddress || '',
                VHAddress: data[0].RHAddress || '',
                COList: mappedCOList.length > 0 ? mappedCOList : [{ VMob1: '', VEName: '', VHName: '' }],
            });

        } catch (error) {
            toast.error(`Error fetching reference details: ${error.message}`);
        }
    };



    const handleChange = (event) => {
        const { name, value } = event.target;
        setReferenceDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    
        const error = validateVoterDetails(name, value);
        setErrors(prevErrors => ({
            ...prevErrors,
            referenceDetails: {
                ...prevErrors.referenceDetails,
                [name]: error,
            },
        }));
    };
    

    const handleCareOfChange = (event, index) => {
        const { name, value } = event.target;
        const updatedCOList = [...referenceDetails.COList];
        updatedCOList[index][name] = value;
        setReferenceDetails(prevDetails => ({
            ...prevDetails,
            COList: updatedCOList,
        }));
    };

    const handleCareOfCheck = (index, event) => {
        const checked = event.target.checked;
        let updatedCOList = [...referenceDetails.COList];
        if (!checked) {
            updatedCOList.splice(index, 1);
        } else if (referenceDetails.COList.length < 5) {
            updatedCOList.splice(index + 1, 0, {
                VMob1: '',
                VEName: '',
                VHName: '',
                NoOfFormsKN: '',
                NoOfFormsKD: '',
                NoOfFormsU: '',
            });
        }
        setReferenceDetails(prevDetails => ({
            ...prevDetails,
            COList: updatedCOList,
        }));
    };

    return (
        <div className='w-full py-4 h-full mx-auto bg-gray-100' style={{ boxShadow: '0 0 5px 1px #ddd' }}>
            <div className="container-fluid flex-col gap-2 flex">
                <div className='flex items-center justify-between py-3 text-black'>
                    <div className='text-xl font-bold mb-4'>Reference Details</div>
                    <div className='flex items-center w-1/3 justify-between'>
                        <p className='select-none text-sm'>Today's Form=0</p>
                        <p className='select-none text-sm'><sup>*</sup>fields are required</p>
                    </div>
                </div>
                <hr />
                <div className="row mt-3">
                    <div className="col-md-3 flex-col gap-2 flex">
                        <Form.Group>
                            <Form.Label>Packet No.<sup className='text-red-500'>*</sup></Form.Label>
                            <Typeahead
                                id="PacketNo"
                                name="PacketNo"
                                onInputChange={(value) => {fetchPacketOptions(value);
                                    const error = validateVoterDetails("PacketNo", value);
                                    setErrors(prevErrors => ({
                                        ...prevErrors,
                                        referenceDetails: {
                                            ...prevErrors.referenceDetails,
                                            PacketNo: error,
                                        },
                                    }));
                                    }}
                                onChange={(selected) => {
                                    if (selected.length > 0) {
                                        const { value } = selected[0];
                                        setReferenceDetails(prevDetails => ({
                                            ...prevDetails,
                                            PacketNo: value,
                                        }));
                                        fetchRefrenceDetails(value);
                                        const error = validateVoterDetails("PacketNo", value);
                                        setErrors(prevErrors => ({
                                            ...prevErrors,
                                            referenceDetails: {
                                                ...prevErrors.referenceDetails,
                                                PacketNo: error,
                                            },
                                        }));
                                        

                                    } else {
                                        setReferenceDetails(prevDetails => ({
                                            ...prevDetails,
                                            PacketNo: '',
                                        }));
                                    }
                                }}
                                options={packetOptions}
                                placeholder="Packet No"
                                
                                // labelKey="PacketNo"
                            // selected={packetOptions.filter(option => option.value === referenceDetails.PacketNo)}
                            />
                            {errors.PacketNo && <div className="text-danger mt-1 text-[0.8rem]">{errors.PacketNo}</div>}
                        </Form.Group>
                    </div>

                </div>
                <div className="row flex my-2">
                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Mobile 1</Form.Label>
                            <Form.Control
                                className='px-2'
                                type="text"
                                name="VMob1"
                                value={referenceDetails.VMob1 || ''}
                                onChange={handleChange}
                                placeholder='Enter Mobile 1'
                                readOnly
                            />
                  
                        </Form.Group>
                    </div>
                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Volunteer (Hindi)</Form.Label>
                            <Form.Control
                                className='px-2'
                                type="text"
                                name="VHName"
                                value={referenceDetails.VHName || ''}
                                onChange={handleChange}
                                placeholder='Enter Volunteer Name'
                                readOnly
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Volunteer (English)</Form.Label>
                            <Form.Control
                                className='px-2'
                                type="text"
                                name="VEName"
                                value={referenceDetails.VEName || ''}
                                onChange={handleChange}
                                placeholder='Enter Volunteer Name'
                                readOnly
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Mobile 2</Form.Label>
                            <Form.Control
                                className='px-2'
                                type="text"
                                name="VMob2"
                                value={referenceDetails.VMob2 || ''}
                                onChange={handleChange}
                                placeholder='Enter Mobile 2'
                                readOnly
                            />
                        </Form.Group>
                    </div>
                </div>
                <div className="row flex my-2">
                    <div className="col-md-6 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Address (English)</Form.Label>
                            <Form.Control
                                type="text"
                                className='px-2'
                                name="VEAddress"
                                value={referenceDetails.VEAddress || ''}
                                onChange={handleChange}
                                placeholder='Enter Address'
                                readOnly
                            />
                        </Form.Group>
                    </div>
                    <div className="col-md-6 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Address (Hindi)</Form.Label>
                            <Form.Control
                                type="text"
                                className='px-2'
                                name="VHAddress"
                                value={referenceDetails.VHAddress || ''}
                                onChange={handleChange}
                                placeholder='Enter Address'
                                readOnly
                            />
                        </Form.Group>
                    </div>
                </div>

                {referenceDetails.COList.map((e, index) => (
                    <div className="row mb-3" key={index}>
                        <Row className="mb-3">
                            <div className="col-md-3 mb-3">
                                <Form.Group>
                                    <Form.Label>Care of Mobile {index + 1} (English)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className='px-2'
                                        placeholder={`Care of Mobile ${index + 1}`}
                                        name="VMob1"
                                        value={e.VMob1 || ''}
                                        onChange={(event) => handleCareOfChange(event, index)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3 mb-3">
                                <Form.Group>
                                    <Form.Label>Care of Name {index + 1} (English)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className='px-2'
                                        placeholder={`Care of (English) ${index + 1}`}
                                        name="VEName"
                                        value={e.VEName || ''}
                                        onChange={(event) => handleCareOfChange(event, index)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-3 mb-3">
                                <Form.Group>
                                    <Form.Label>Care of Name {index + 1} (Hindi)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className='px-2'
                                        placeholder={`Care of (Hindi) ${index + 1}`}
                                        name="VHName"
                                        value={e.VHName || ''}
                                        onChange={(event) => handleCareOfChange(event, index)}
                                        readOnly
                                    />
                                </Form.Group>
                            </div>

                            {index < 2 && (
                                <div className="col-md-2 mb-3">
                                    <Form.Group>
                                        <Form.Label>Add Care Of {index + 2}<sup className='text-red-500'>*</sup></Form.Label>
                                        <br />
                                        <Form.Check
                                            type="checkbox"
                                            className='w-6 h-6'
                                            checked={referenceDetails.COList.length > index + 1}
                                            onChange={(event) => handleCareOfCheck(index + 1, event)}
                                            readOnly
                                        />
                                    </Form.Group>
                                </div>
                            )}

                        </Row>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReferenceDetailsForm;
