import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { validateVoterDetails } from '../../Validation/voterDetailsValidation';

function AddressInformationForm({ addressDetail, setAddressDetail, errors, setErrors }) {
  const [AreaVillOptions, setAreaVillOptions] = useState([]);
  const [AreaFullDetails, setAreaFullDetails] = useState([]);
  const [tehsilOption, setTehsilOption] = useState([]);
  const [councilOption, setCouncilOption] = useState([]);
  const [VSOption, setVSOption] = useState([]);
  const [WBOption, setWBOption] = useState([]);
  const [CBOption, setCBOption] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddressDetail((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    if (name === 'TehId') {
      const selectedTehsil = tehsilOption.find((tehsil) => tehsil.TehId === parseInt(value));
      if (selectedTehsil) {
        const filteredCouncils = AreaFullDetails.filter((detail) => detail.EName === selectedTehsil.EName);
        const uniqueCouncilsFiltered = Array.from(new Set(filteredCouncils.map((a) => a.counId))).map((counId) =>
          filteredCouncils.find((a) => a.counId === counId)
        );
        setCouncilOption(uniqueCouncilsFiltered);
      }
    } else if (name === 'counId') {
      const selectedCouncil = councilOption.find((council) => council.counId === parseInt(value));
      if (selectedCouncil) {
        const filteredVS = AreaFullDetails.filter((detail) => detail.ECouncil === selectedCouncil.ECouncil);
        const uniqueVSFiltered = Array.from(new Set(filteredVS.map((a) => a.VSId))).map((VSId) =>
          filteredVS.find((a) => a.VSId === VSId)
        );
        setVSOption(uniqueVSFiltered);
      }
    } else if (name === 'VSId') {
      const selectedVS = VSOption.find((vs) => vs.VSId === parseInt(value));
      if (selectedVS) {
        const filteredWB = AreaFullDetails.filter((detail) => detail.EVidhanSabha === selectedVS.EVidhanSabha);
        const uniqueWBFiltered = Array.from(new Set(filteredWB.map((a) => a.WBId))).map((WBId) =>
          filteredWB.find((a) => a.WBId === WBId)
        );
        setWBOption(uniqueWBFiltered);
      }
    } else if (name === 'WBId') {
      const selectedWB = WBOption.find((WB) => WB.WBId === parseInt(value));
      if (selectedWB) {
        const filteredCB = AreaFullDetails.filter((detail) => detail.EWardBlock === selectedWB.EWardBlock);
        const uniqueCBFiltered = Array.from(new Set(filteredCB.map((a) => a.ChkBlkId))).map((ChkBlkId) =>
          filteredCB.find((a) => a.ChkBlkId === ChkBlkId)
        );
        setCBOption(uniqueCBFiltered);
      }
    } else if(name== 'ChkBlkId'){
      const selectedCB = CBOption.find((CB)=> CB.ChkBlkId === parseInt(value));
      console.log(selectedCB);
      setAddressDetail((prevDetails) => ({
        ...prevDetails,
        AreaId: selectedCB.Id,
        TehId: selectedCB.TehId,
        counId: selectedCB.counId,
        VSId: selectedCB.VSId,
        WBId: selectedCB.WBId,
        ChkBlkId: selectedCB.ChkBlkId,
      }));
    }
  };
  

  const fetchAreaVillOptions = async (input) => {
    try {
      const response = await fetch('/api/v1/feedingStaff/searchAreaVill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggested AreaVill');
      }

      const data = await response.json();
      setAreaVillOptions(data);
    } catch (error) {
      console.error('Error fetching suggested AreaVill:', error);
    }
  };

  const fetchAllAreaDetails = async (EAreaVill, HnoRange) => {
    try {
      
      const response = await fetch('/api/v1/feedingStaff/allAreaDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ EAreaVill, HnoRange }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all area details');
      }

      const data = await response.json();
      setAreaFullDetails(data);

      const Tehsil = [];
      data.forEach((th) => {
        if (!Tehsil.some((existing) => existing.TehId === th.TehId)) {
          Tehsil.push({ TehId: th.TehId, EName: th.EName });
        }
      });

      setTehsilOption(Tehsil);

    } catch (error) {
      console.error('Error fetching all area details:', error);
    }
  };

  useEffect(() => {
    if (tehsilOption.length === 1) {
      const singleTehsil = tehsilOption[0];
      setAddressDetail((prevDetails) => ({
        ...prevDetails,
        TehId: singleTehsil.TehId,
      }));
      const filteredCouncils = AreaFullDetails.filter((detail) => detail.EName === singleTehsil.EName);
      const uniqueCouncilsFiltered = Array.from(new Set(filteredCouncils.map((a) => a.counId))).map((counId) =>
        filteredCouncils.find((a) => a.counId === counId)
      );
      setCouncilOption(uniqueCouncilsFiltered);
    }
  }, [tehsilOption, AreaFullDetails, setAddressDetail]);

  useEffect(() => {
    if (councilOption.length === 1) {
      const singleCouncil = councilOption[0];
      setAddressDetail((prevDetails) => ({
        ...prevDetails,
        counId: singleCouncil.counId,
      }));
      const filteredVS = AreaFullDetails.filter((detail) => detail.ECouncil === singleCouncil.ECouncil);
      const uniqueVSFiltered = Array.from(new Set(filteredVS.map((a) => a.VSId))).map((VSId) =>
        filteredVS.find((a) => a.VSId === VSId)
      );
      setVSOption(uniqueVSFiltered);
    }
  }, [councilOption, AreaFullDetails, setAddressDetail]);

  useEffect(() => {
    if (VSOption.length === 1) {
      const singleVS = VSOption[0];
      setAddressDetail((prevDetails) => ({
        ...prevDetails,
        VSId: singleVS.VSId,
      }));
      const filteredWB = AreaFullDetails.filter((detail) => detail.EVidhanSabha === singleVS.EVidhanSabha);
      const uniqueWBFiltered = Array.from(new Set(filteredWB.map((a) => a.WBId))).map((WBId) =>
        filteredWB.find((a) => a.WBId === WBId)
      );
      setWBOption(uniqueWBFiltered);
    }
  }, [VSOption, AreaFullDetails, setAddressDetail]);

  useEffect(() => {
    if (WBOption.length === 1) {
      const singleWB = WBOption[0];
      setAddressDetail((prevDetails) => ({
        ...prevDetails,
        WBId: singleWB.WBId,
      }));
      const filteredCB = AreaFullDetails.filter((detail) => detail.EWardBlock === singleWB.EWardBlock);
      const uniqueCBFiltered = Array.from(new Set(filteredCB.map((a) => a.ChkBlkId))).map((ChkBlkId) =>
        filteredCB.find((a) => a.ChkBlkId === ChkBlkId)
      );
      setCBOption(uniqueCBFiltered);
    }
  }, [WBOption, AreaFullDetails, setAddressDetail]);

  useEffect(() => {
    if (CBOption.length === 1) {
      const singleCB = CBOption[0];
      setAddressDetail((prevDetails) => ({
        ...prevDetails,
        ChkBlkId: singleCB.ChkBlkId,
      }));
   
    }
  }, [ CBOption, AreaFullDetails, setAddressDetail]);

  return (
    <div className="w-full h-full mx-auto my-5 px-2 py-4 bg-gray-100" style={{ boxShadow: '0 0 5px 1px #ddd' }}>
      <div className="container-fluid flex-col gap-2 flex">
        <div className="flex items-center justify-between py-3">
          <div className="text-xl font-bold mb-4">Address Information</div>
          <p className="select-none text-sm text-black">
            <sup>*</sup>fields are required
          </p>
        </div>
        <hr />
      </div>

      <div className="row flex mt-3">
        <div className="col-md-3 flex-col gap-2 flex mt-1">
          <Form.Group>
            <Form.Label>Area / Village</Form.Label>
            <Typeahead
              id="area-village-typeahead"
              onInputChange={(value) => fetchAreaVillOptions(value)}
              onChange={(selected) => {
                if (selected.length > 0) {
                  const { EAreaVill, HnoRange} = selected[0];
                  setAddressDetail((prevDetails) => ({
                    ...prevDetails,
                    EAreaVill,
                    AreaId: '',
                    TehId: '',
                    counId: '',
                    VSId: '',
                    WBId: '',
                    ChkBlkId: '',
                  }));
                  setTehsilOption([]);
                  setCouncilOption([]);
                  setVSOption([]);
                  setWBOption([]);
                  setCBOption([]);
                  fetchAllAreaDetails(EAreaVill, HnoRange);
                }
              }}
              options={AreaVillOptions}
              placeholder="Area/Village"
              labelKey="EAreaVill"
              renderMenuItemChildren={(option) => <div>{option.EAreaVill + ' | '+ option.HnoRange}</div>}
            />
          </Form.Group>
        </div>

        <div className="col-md-3 flex-col gap-2 flex mt-1">
          <Form.Group>
            <Form.Label>Tehsil</Form.Label>
            <Form.Control
              as="select"
              className="form-select px-2"
              name="TehId"
              value={addressDetail.TehId || ''}
              onChange={handleChange}
            >
              <option value="">--Select Tehsil--</option>
              {tehsilOption.map((tehsil) => (
                <option key={tehsil.TehId} value={tehsil.TehId}>
                  {tehsil.EName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>

        <div className="col-md-3 flex-col gap-2 flex mt-1">
          <Form.Group>
            <Form.Label>Nikaya</Form.Label>
            <Form.Control
              as="select"
              className="form-select px-2"
              name="counId"
              value={addressDetail.counId || ''}
              onChange={handleChange}
            >
              <option value="">--Select Nikaya--</option>
              {councilOption.map((council) => (
                <option key={council.counId} value={council.counId}>
                  {council.ECouncil}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>

        <div className="col-md-3 flex-col gap-2 flex mt-1">
          <Form.Group>
            <Form.Label>VidhanSabha</Form.Label>
            <Form.Control
              as="select"
              className="form-select px-2"
              name="VSId"
              value={addressDetail.VSId || ''}
              onChange={handleChange}
            >
              <option value="">--Select VidhanSabha--</option>
              {VSOption.map((vidhanSabha) => (
                <option key={vidhanSabha.VSId} value={vidhanSabha.VSId}>
                  {vidhanSabha.EVidhanSabha}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>

        <div className="col-md-3 flex-col gap-2 flex mt-1">
          <Form.Group>
            <Form.Label>Ward/Block</Form.Label>
            <Form.Control
              as="select"
              className="form-select px-2"
              name="WBId"
              value={addressDetail.WBId || ''}
              onChange={handleChange}
            >
              <option value="">--Select Ward/Block--</option>
              {WBOption.map((WB) => (
                <option key={WB.WBId} value={WB.WBId}>
                  {WB.WardNo + ' - ' + WB.EWardBlock}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>

        <div className="col-md-3 flex-col gap-2 flex mt-1">
          <Form.Group>
            <Form.Label>Chak Block/ Panchayat</Form.Label>
            <Form.Control
              as="select"
              className="form-select px-2"
              name="ChkBlkId"
              value={addressDetail.ChkBlkId || ''}
              onChange={handleChange}
            >
              <option value="">--Select Chak Block/ Panchayat--</option>
              {CBOption.map((CBP) => (
                <option key={CBP.ChkBlkId} value={CBP.ChkBlkId}>
                  {CBP.ChakNo + ' - ' +  CBP.ECBPanch}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </div>

        <div className="col-md-3 flex-col gap-2 flex mt-1">
          <Form.Group>
            <Form.Label>HNo</Form.Label>
            <Form.Control
              type="text"
              name="HNo"
              className="px-2"
              value={addressDetail.HNo}
              onChange={handleChange}
              placeholder="HNo"
            />
          </Form.Group>
        </div>
        <div className="col-md-3 flex-col gap-2 flex mt-1">
          <Form.Group>
            <Form.Label>Landmark</Form.Label>
            <Form.Control
              type="text"
              name="Landmark"
              className="px-2"
              value={addressDetail.Landmark}
              onChange={handleChange}
              placeholder="Landmark"
            />
          </Form.Group>
        </div>
      </div>
    </div>
  );
}

export default AddressInformationForm;
