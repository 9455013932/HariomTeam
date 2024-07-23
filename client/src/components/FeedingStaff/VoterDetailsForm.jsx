import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Relation, Occupation } from '../Pages/Constaint.jsx';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { validateVoterDetails } from '../../Validation/voterDetailsValidation.js';

function VoterDetailsForm({ voterDetails, setVoterDetails, errors, setErrors }) {


    const [surnameOptions, setSurnameOptions] = useState([]);
    const [relativeSurnameOptions, setRelativeSurnameOptions] = useState([]);
    const [casteOptions, setCasteOptions] = useState([]);

    const fetchSurnameOptions = async (input, setter) => {
        try {
            const response = await fetch('/api/v1/feedingStaff/searchSurname', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: input })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch suggested Caste');
            }

            const data = await response.json();
            setter(data);
        } catch (error) {
            console.error('Error fetching suggested Caste:', error);
        }
    };

    const fetchCasteOptions = async (surname) => {
        try {
            const response = await fetch('/api/v1/feedingStaff/searchCaste', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ surname })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch suggested castes');
            }

            const data = await response.json();
            setCasteOptions(data);
        } catch (error) {
            console.error('Error fetching suggested castes:', error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setVoterDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));


        if (name === 'DOB') {
            const dob = new Date(value);
            const ageDate = new Date(Date.now() - dob.getTime());
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);
            setVoterDetails(prevDetails => ({
                ...prevDetails,
                Age: age,
            }));
        }


        if (name === 'Age') {
            const today = new Date();
            const birthDate = new Date(today.getFullYear() - value, today.getMonth(), today.getDate());
            setVoterDetails(prevDetails => ({
                ...prevDetails,
                DOB: birthDate.toISOString().split('T')[0],
            }));
        }

        const error = validateVoterDetails(name, value);
        setErrors(prevErrors => ({
            ...prevErrors,
            voterDetails: {
                ...prevErrors.voterDetails,
                [name]: error,
            }
        }));
    };


    return (
        <>
            <div className='w-full h-full mx-auto my-5 px-2 py-4 bg-gray-100' style={{ boxShadow: "0 0 5px 1px #ddd" }}>
                <div className="container-fluid flex-col gap-2 flex">
                    <div className='flex items-center justify-between py-3'>
                        <div className='text-xl font-bold mb-4'>Voters Details</div>
                        <p className='select-none text-sm text-black'><sup>*</sup>fields are required</p>
                    </div>
                    <hr />
                </div>

                <div className="row mt-5">
                    <div className="col-md-3 mt-1">
                        <Form.Group>
                            <Form.Label>First Name (English)<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                className='px-2'
                                type="text"
                                name="EFName"
                                value={voterDetails.EFName}
                                onChange={handleChange}
                                placeholder="First Name (English)"

                            />
                            {errors.EFName && <div className="text-danger mt-1 text-[0.8rem]">{errors.EFName}</div>}

                        </Form.Group>
                    </div>
                    <div className="col-md-3 mt-1">
                        <Form.Group>
                            <Form.Label>First Name (Hindi)<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                type="text"
                                className='px-2'
                                name="HFName"
                                value={voterDetails.HFName}
                                onChange={handleChange}
                                placeholder="First Name (Hindi)"
                            />
                            {errors.HFName && <div className="text-danger mt-1 text-[0.8rem]">{errors.HFName}</div>}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Last Name (English)<sup className='text-red-500'>*</sup></Form.Label>
                            <Typeahead
                                id="last-name-english"
                                name="ELName"
                                onInputChange={(value) => fetchSurnameOptions(value, setSurnameOptions)}
                                onChange={(selected) => {
                                    if (selected.length > 0) {
                                        const [choice] = selected;
                                        setVoterDetails(prevDetails => ({
                                            ...prevDetails,
                                            ELName: choice.ESurname,
                                        }));
                                        fetchCasteOptions(choice.ESurname);
                                    } else {
                                        setVoterDetails(prevDetails => ({
                                            ...prevDetails,
                                            ELName: '',
                                        }));
                                    }

                                    const error = validateVoterDetails("ELName", selected.length > 0 ? selected[0].ESurname : "");

                                    setErrors(prevErrors => ({
                                        ...prevErrors,
                                        voterDetails: {
                                            ...prevErrors.voterDetails,
                                            ELName: error,
                                        },
                                    }));
                                }}
                                options={surnameOptions}
                                placeholder='Last Name (English)'
                                labelKey="ESurname"
                                renderMenuItemChildren={(option) => (
                                    <div>
                                        {option.ESurname}
                                    </div>
                                )}
                            />
                            {errors.ELName && <div className="text-danger mt-1 text-[0.8rem]">{errors.ELName}</div>}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 mt-1">
                        <Form.Group>
                            <Form.Label>Last Name (Hindi)<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                type="text"
                                className='px-2'
                                name="HLName"
                                value={voterDetails.HLName}
                                onChange={handleChange}
                                placeholder="Last Name (Hindi)"
                            />
                            {errors.HLName && <div className="text-danger mt-1 text-[0.8rem]">{errors.HLName}</div>}
                        </Form.Group>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Relation<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                as="select"
                                className='form-select px-2'
                                name="RType"
                                value={voterDetails.RType}
                                onChange={handleChange}

                            >
                                <option value="">--select relation--</option>
                                {Relation.map((c) => (
                                    <option key={c.value} value={c.value}>{c.name}</option>
                                ))}
                            </Form.Control>
                            {errors.RType && <div className="text-danger mt-1 text-[0.8rem]">{errors.RType}</div>}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Rel. First Name (English)<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                type="text"
                                className='px-2'
                                name="ERFName"
                                value={voterDetails.ERFName}
                                onChange={handleChange}
                                placeholder="Rel. First Name (English)"

                            />
                            {errors.ERFName && <div className="text-danger text-[0.8rem]">{errors.ERFName}</div>}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Rel. First Name (Hindi)<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                type="text"
                                className='px-2'
                                name="HRFName"
                                value={voterDetails.HRFName}
                                onChange={handleChange}
                                placeholder="Rel. First Name (Hindi)"
                            />
                            {errors.HRFName && <div className="text-danger mt-1 text-[0.8rem]">{errors.HRFName}</div>}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Rel. Last Name (English)<sup className='text-red-500'>*</sup></Form.Label>
                            <Typeahead
                                id="rel-last-name-english"
                                onInputChange={(value) => fetchSurnameOptions(value, setRelativeSurnameOptions)}
                                onChange={(selected) => {
                                    if (selected.length > 0) {
                                        const [choice] = selected;
                                        setVoterDetails(prevDetails => ({
                                            ...prevDetails,
                                            ERLName: choice.ESurname,
                                        }));
                                    }
                                    const error = validateVoterDetails("ERLName", selected.length > 0 ? selected[0].ERLName : "");

                                    setErrors(prevErrors => ({
                                        ...prevErrors,
                                        voterDetails: {
                                            ...prevErrors.voterDetails,
                                            ERLName: error,
                                        },
                                    }));
                                }}
                                options={relativeSurnameOptions}
                                placeholder='Rel. Last Name (English)'
                                labelKey="ESurname"
                                defaultInputValue={voterDetails.ERLName}
                                renderMenuItemChildren={(option) => (
                                    <div>
                                        {option.ESurname}
                                    </div>
                                )}
                            />
                            {errors.ERLName && <div className="text-danger mt-1 text-[0.8rem]">{errors.ERLName}</div>}
                        </Form.Group>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Rel. Last Name (Hindi)<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                type="text"
                                className='px-2'
                                name="HRLName"
                                value={voterDetails.HRLName}
                                onChange={(e) => setVoterDetails(prevDetails => ({
                                    ...prevDetails,
                                    HRLName: e.target.value,
                                }))}
                                placeholder="Rel. Last Name (Hindi)"
                            />
                            {errors.HRLName && <div className="text-danger mt-1 text-[0.8rem]">{errors.HRLName}</div>}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Caste<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                as="select"
                                className='form-select px-2'
                                name="CasteId"
                                value={voterDetails.CasteId}
                                onChange={handleChange}
                            >

                                <option value="">--Select Caste--</option>
                                {casteOptions.map((caste) => (
                                    <option key={caste.CasteId} value={caste.CasteId}>{caste.ECaste}</option>
                                ))}
                            </Form.Control>
                            {errors.CasteId && <div className="text-danger mt-1 text-[0.8rem]">{errors.CasteId}</div>}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Qualification<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                as="select"
                                className="form-select px-2"
                                name="Qualification"
                                value={voterDetails.Qualification}
                                onChange={handleChange}

                            >
                                <option value="">--Select Qualification--</option>
                                <option value="Post Graduate">Post Graduate</option>
                                <option value="Graduate">Graduate</option>
                            </Form.Control>
                            {errors.Qualification && <div className="text-danger mt-1 text-[0.8rem]">{errors.Qualification}</div>}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Occupation<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                as="select"
                                className='form-select px-2'
                                name="Occupation"
                                value={voterDetails.Occupation}
                                onChange={handleChange}

                            >
                                <option value="">--select Occupation--</option>
                                {Occupation.map((c) => (
                                    <option key={c.value} value={c.value}>{c.name}</option>
                                ))}
                            </Form.Control>
                            {errors.Occupation && <div className="text-danger mt-1 text-[0.8rem]">{errors.Occupation}</div>}
                        </Form.Group>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Age<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                type="number"
                                name="Age"
                                value={voterDetails.Age}
                                onChange={handleChange}
                                className="outline-none border w-full px-2"
                                placeholder="Enter Age"

                            />
                            {errors.Age && <div className="text-danger mt-1 text-[0.8rem]">{errors.Age}</div>}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>DOB<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                type="date"
                                name="DOB"
                                value={voterDetails.DOB}
                                onChange={handleChange}
                                className="outline-none border w-full px-2"
                                placeholder="DOB"


                            />
                            {errors.DOB && <div className="text-danger mt-1 text-[0.8rem]">{errors.DOB}</div>}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Gender<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                as="select"
                                className='form-select px-2'
                                name="Sex"
                                value={voterDetails.Sex}
                                onChange={handleChange}

                            >
                                <option value="">--Select Gender--</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Third Gender">Third Gender</option>
                            </Form.Control>
                            {errors.Sex && <div className="text-danger mt-1 text-[0.8rem]">{errors.Sex}</div>}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Mobile No<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                type="text"
                                className='px-2'
                                name="MNo"
                                value={voterDetails.MNo}
                                onChange={handleChange}
                                placeholder="Mobile No"

                            />
                            {errors.MNo && <div className="text-danger text-[0.8rem]">{errors.MNo}</div>}
                        </Form.Group>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Alternative Mobile Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="MNo2"
                                className='px-2'
                                value={voterDetails.MNo2}
                                onChange={handleChange}
                                placeholder="Mobile No 2"
                            />
                            {errors.MNo2 && <div className="text-danger text-[0.8rem]">{errors.MNo2}</div>}
                        </Form.Group>
                    </div>

                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Aadhar No</Form.Label>
                            <Form.Control
                                type="text"
                                className='px-2'
                                name="AadharNo"
                                inputMode="numeric"
                                pattern="\d{12}"
                                value={voterDetails.AadharNo}
                                onChange={handleChange}
                                placeholder="Aadhar No"
                            />
                            {errors.AadharNo && <div className="text-danger text-[0.8rem]">{errors.AadharNo}</div>}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>VoterId</Form.Label>
                            <Form.Control
                                className='px-2'
                                type="text"
                                name="VIdNo"
                                value={voterDetails.VIdNo}
                                onChange={handleChange}
                                placeholder="VoterId"
                            />
                                {errors.VIdNo && <div className="text-danger text-[0.8rem]">{errors.VIdNo}</div>}
                        </Form.Group>
                    </div>
                    <div className="col-md-3 flex-col gap-2 flex mt-1">
                        <Form.Group>
                            <Form.Label>Graduate Comp Year<sup className='text-red-500'>*</sup></Form.Label>
                            <Form.Control
                                type="number"
                                className='px-2'
                                name="GCYear"
                                value={voterDetails.GCYear}
                                onChange={handleChange}
                                placeholder="Graduate Comp Year"

                            />
                            {errors.GCYear && <div className="text-danger text-[0.8rem]">{errors.GCYear}</div>}
                        </Form.Group>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VoterDetailsForm;
