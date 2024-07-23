import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReferenceDetailsForm from './ReferenceDetailsForm.jsx';
import VoterDetailsForm from './VoterDetailsForm.jsx';
import AddressInformationForm from './AddressInformationForm.jsx';
import VoterDocs from './VoterDocs.jsx';
import { Occupation } from '../Pages/Constaint.jsx';
import { validateVoterDetails } from '../../Validation/voterDetailsValidation.js';


function AddVoter() {
    const [referenceDetails, setReferenceDetails] = useState({
        PacketNo: '',
        IncRefId: '',
        VMob1: '',
        VMob2: '',
        VEName: '',
        VHName: '',
        VEAddress: '',
        VHAddress: '',
        COList: [
            { VMob1: '', VEName: '', VHName: '' }
        ],
    });

    const [voterDetails, setVoterDetails] = useState({
        EFName: '',
        HFName: '',
        ELName: '',
        HLName: '',
        RType: '',
        ERFName: '',
        HRFName: '',
        ERLName: '',
        HRLName: '',
        CasteId: '',
        ECaste: '',
        Qualification: '',
        Occupation: Occupation ? '' : 'NA',
        Age: '',
        DOB: '',
        Sex: '',
        MNo: '',
        MNo2: '',
        AadharNo: '',
        VIdNo: '',
        GCYear: '',
    });

    const [addressDetail, setAddressDetail] = useState({
        AreaId: '',
        EAreaVill: '',
        TehId: '',
        EName: '',
        CounId: '',
        ECouncil: '',
        VSId: '',
        EVidhanSabha: '',
        WBId: '',
        EWardBlock: '',
        ChkBlkId: '',
        ECBPanch: '',
        HNo: '',
        Landmark: '',
    });

    const [voterDocs, setVoterDocs] = useState({
        Image: '',
        IdProof: '',
        Degree: '',
   
    });

    const [errors, setErrors] = useState({
        referenceDetails: {},
        voterDetails: {},
        addressDetail: {},
        voterDocs: {},
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate voter details
        const voterDetailErrors = {};
        Object.keys(voterDetails).forEach((field) => {
            const error = validateVoterDetails(field, voterDetails[field]);
            if (error) {
                voterDetailErrors[field] = error;
            }
        });

        // Validate reference details
        const referenceDetailsErrors = {};
        Object.keys(referenceDetails).forEach((field) => {
            const error = validateVoterDetails(field, referenceDetails[field]);
            if (error) {
                referenceDetailsErrors[field] = error;
            }
        });

        const addressDetailError = {};
        Object.keys(addressDetail).forEach((field)=>{
            const error = validateVoterDetails(field, addressDetail[field]);
            if (error){
                addressDetailError[field]= error;
            }
        });


        if (Object.keys(addressDetailError).length > 0 || Object.keys(voterDetailErrors).length > 0 || Object.keys(referenceDetailsErrors).length > 0) {
            setErrors({
                ...errors,
                voterDetails: voterDetailErrors,
                referenceDetails: referenceDetailsErrors,
                addressDetail: addressDetailError,
            });
            toast.error('Please fix the errors in the form.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('referenceDetails', JSON.stringify({
                IncRefId: referenceDetails.IncRefId,
                PacketNo: referenceDetails.PacketNo,
            }));
            formData.append('voterDetails', JSON.stringify(voterDetails));
            formData.append('addressDetail', JSON.stringify(addressDetail));

            Object.keys(voterDocs).forEach(key => {
                if (voterDocs[key].file) {
                    formData.append(key, voterDocs[key].file);
                }
            });

            const response = await fetch('/api/v1/feedingStaff/addVoter', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to create voter');
            }

            const data = await response.json();
            toast.success('Voter created successfully!');
            // Reset forms after successful submission
            setReferenceDetails({
                PacketNo: '',
                IncRefId: '',
                VMob1: '',
                VMob2: '',
                VEName: '',
                VHName: '',
                VEAddress: '',
                VHAddress: '',
                COList: [
                    { VMob1: '', VEName: '', VHName: '' }
                ],
            });
            setVoterDetails({
                EFName: '',
                HFName: '',
                ELName: '',
                HLName: '',
                RType: '',
                ERFName: '',
                HRFName: '',
                ERLName: '',
                HRLName: '',
                CasteId: '',
                ECaste: '',
                Qualification: '',
                Occupation: Occupation ? '' : 'NA',
                Age: '',
                DOB: '',
                Sex: '',
                MNo: '',
                MNo2: '',
                AadharNo: '',
                VIdNo: '',
                GCYear: '',
            });
            setAddressDetail({
                AreaId: '',
                EAreaVill: '',
                TehId: '',
                EName: '',
                CounId: '',
                ECouncil: '',
                VSId: '',
                EVidhanSabha: '',
                WBId: '',
                EWardBlock: '',
                ChkBlkId: '',
                ECBPanch: '',
                HNo: '',
                Landmark: '',
            });
            setVoterDocs({
                Image: '',
                IdProof: '',
                Degree: '',
                
            });
            setErrors({
                referenceDetails: {},
                voterDetails: {},
                addressDetail: {},
                voterDocs: {},
            });

        } catch (error) {
            toast.error('Error creating voter.');
        }
    };

    return (
        <main className="bg-gray-100">
            <ToastContainer />
            <div className="container py-4 text-black">
                <Form onSubmit={handleSubmit} className="Council-form">
                    <ReferenceDetailsForm
                        referenceDetails={referenceDetails}
                        setReferenceDetails={setReferenceDetails}
                        errors={errors.referenceDetails}
                        setErrors={setErrors}
                    />

                    <VoterDetailsForm
                        voterDetails={voterDetails}
                        setVoterDetails={setVoterDetails}
                        errors={errors.voterDetails}
                        setErrors={setErrors}
                    />

                    <AddressInformationForm
                        addressDetail={addressDetail}
                        setAddressDetail={setAddressDetail}
                        errors={errors.addressDetail}
                        setErrors={setErrors}
                    />

                    <VoterDocs
                        voterDocs={voterDocs}
                        setVoterDocs={setVoterDocs}
                        errors={errors.voterDocs}
                        setErrors={setErrors}
                    />

                    <Button type="submit" className="mt-4">Submit</Button>
                </Form>
            </div>
        </main>
    );
}

export default AddVoter;
