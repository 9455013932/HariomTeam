import jwt from 'jsonwebtoken';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { pool } from '../db/database.js';


function queryDatabase(sql, params) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

const AddCaste = asyncHandler(async (req, res) => {
    const { ESurname, HSurname, ECaste, HCaste } = req.body;

    if (!ESurname || !HSurname || !ECaste || !HCaste) {
        throw new ApiError(400, "Please enter all details!")
    }

    try {
        await queryDatabase(
            'INSERT INTO caste (ESurname, HSurname, ECaste, HCaste) VALUES (?, ?, ?, ?)',
            [ESurname, HSurname, ECaste, HCaste]
        );

        const addedCaste = {
            ESurname, HSurname, ECaste, HCaste
        };

        return res.status(201).json(
            new ApiResponse(200, addedCaste, "caste details submitted successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const casteDetails = asyncHandler(async (req, res) => {

    try {
        const results = await queryDatabase('SELECT * FROM caste');
        return res.json(results); // Should correctly return the results array
    } catch (error) {
        console.error('Database query error', error);
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateCasteDetail = asyncHandler(async (req, res) => {
    const { ID, ESurname, HSurname, ECaste, HCaste } = req.body;
    if (!ID || !ESurname || !HSurname || !ECaste || !HCaste) {
        throw new ApiError(400, "Please enter all details!")
    }

    try {
        await queryDatabase(
            'UPDATE caste SET ESurname= ?, HSurname= ?, ECaste= ?, HCaste= ? WHERE ID= ?',
            [ESurname, HSurname, ECaste, HCaste, ID]
        );

        const updatedCaste = {
            ID, ESurname, HSurname, ECaste, HCaste
        };

        return res.status(201).json(
            new ApiResponse(200, updatedCaste, "Caste details Updated successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddTehsil = asyncHandler(async (req, res) => {
    const { EName, HName } = req.body;

    if (!EName || !HName) {
        throw new ApiError(400, "Please enter all details!")
    }

    try {
        await queryDatabase(
            'INSERT INTO tehsillist (EName, HName) VALUES (?, ?)',
            [EName, HName]
        );

        const addedTehsil = {
            EName, HName
        };

        return res.status(201).json(
            new ApiResponse(200, addedTehsil, "Tehsil details submitted successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const TehsilDetails = asyncHandler(async (req, res) => {

    try {
        const results = await queryDatabase('SELECT * FROM tehsillist');
        return res.json(results); // Should correctly return the results array
    } catch (error) {
        console.error('Database query error', error);
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateTehsilDetail = asyncHandler(async (req, res) => {
    const { Id, EName, HName } = req.body;
    if (!Id || !EName || !HName) {
        throw new ApiError(400, "Please enter all details!")
    }

    try {
        await queryDatabase(
            'UPDATE Tehsillist SET EName= ?, HName= ? WHERE Id= ?',
            [EName, HName, Id]
        );

        const updatedCaste = {
            EName, HName, Id
        };

        return res.status(201).json(
            new ApiResponse(200, updatedCaste, "Tehsil details Updated successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});


const DeleteTehsilDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;


    try {
        await queryDatabase(
            'DELETE FROM tehsillist WHERE Id= ?',
            [Id]
        );


        return res.status(201).json(
            new ApiResponse(200, "Tehsil details Deleted successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddCouncil = asyncHandler(async (req, res) => {
    const { ECouncil, HCouncil, TehId } = req.body;

    if (!ECouncil || !HCouncil || !TehId)
        throw new ApiError(400, 'Plaese Enter All the Details')


    try {
        await queryDatabase(
            'INSERT INTO council (TehId, ECouncil, HCouncil) VALUES (?, ?, ?)',
            [TehId, ECouncil, HCouncil]
        );

        const AddedCouncil = {
            TehId, ECouncil, HCouncil
        }
        return res.status(201).json(
            new ApiResponse(200, AddedCouncil, "Tehsil details submitted successfully")
        );

    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const CouncilDetails = asyncHandler(async (req, res) => {

    try {
        const results = await queryDatabase('SELECT council.*, tehsillist.EName FROM tehsillist RIGHT JOIN council ON council.TehId = tehsillist.Id');

        return res.json(results); // Should correctly return the results array
    } catch (error) {
        console.error('Database query error', error);
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateCouncilDetail = asyncHandler(async (req, res) => {
    const { Id, TehId, ECouncil, HCouncil } = req.body;
    if (!Id, !TehId || !ECouncil || !HCouncil) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        await queryDatabase(
            'UPDATE council SET ECouncil= ?, HCouncil= ?, TehId= ? WHERE Id= ?',
            [ECouncil, HCouncil, TehId, Id]
        );

        const updatedCouncil = {
            ECouncil, HCouncil, TehId
        };

        return res.status(201).json(
            new ApiResponse(200, updatedCouncil, "Council details Updated successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});


const DeleteCouncilDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;


    try {
        await queryDatabase(
            'DELETE FROM council WHERE Id= ?',
            [Id]
        );


        return res.status(201).json(
            new ApiResponse(200, "council details Deleted successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddVidhanSabha = asyncHandler(async (req, res) => {
    const { EVidhanSabha, HVidhanSabha, VSNo, counId } = req.body;



    if (!EVidhanSabha || !HVidhanSabha || !counId || !VSNo)
        throw new ApiError(400, 'Plaese Enter All the Details')


    try {
        await queryDatabase(
            'INSERT INTO vidhansabha (counId, EVidhanSabha, HVidhanSabha, VSNo) VALUES (?, ?, ?,?)',
            [counId, EVidhanSabha, HVidhanSabha, VSNo]
        );
        const AddedCouncil = {
            counId, EVidhanSabha, HVidhanSabha, VSNo
        }
        return res.status(201).json(
            new ApiResponse(200, AddedCouncil, "Tehsil details submitted successfully")
        );

    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const VidhanSabhaDetails = asyncHandler(async (req, res) => {

    try {
        const results = await queryDatabase('SELECT vidhansabha.*, council.ECouncil, tehsillist.EName, tehsillist.Id as TehId FROM vidhansabha INNER JOIN council ON vidhansabha.counId = council.id INNER JOIN tehsillist ON tehsillist.id = council.TehId;');

        return res.json(results); // Should correctly return the results array
    } catch (error) {
        console.error('Database query error', error);
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateVidhanSabhaDetail = asyncHandler(async (req, res) => {
    // counId, EVidhanSabha, HVidhanSabha, VSNo
    const { Id, counId, EVidhanSabha, HVidhanSabha, VSNo } = req.body;

    if (!Id, !counId || !EVidhanSabha || !HVidhanSabha || !VSNo) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        await queryDatabase(
            'UPDATE vidhansabha SET EVidhanSabha= ?, HVidhanSabha= ?, VSNo =?, counId =? WHERE Id= ?',
            [EVidhanSabha, HVidhanSabha, VSNo, counId, Id]
        );

        const updatedVS = {
            EVidhanSabha, HVidhanSabha, VSNo, counId, Id
        };

        return res.status(201).json(
            new ApiResponse(200, updatedVS, "VidhanSabha details Updated successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const DeleteVidhanSabhaDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;


    try {
        await queryDatabase(
            'DELETE FROM VidhanSabha WHERE Id= ?',
            [Id]
        );


        return res.status(201).json(
            new ApiResponse(200, "VidhanSabha details Deleted successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddWardBlock = asyncHandler(async (req, res) => {
    const { EWardBlock, HWardBlock, WardNo, VSId } = req.body;

    if (!EWardBlock || !HWardBlock || !WardNo || !VSId)
        throw new ApiError(400, 'Plaese Enter All the Details')


    try {
        await queryDatabase(
            'INSERT INTO wardblock (VSId, EWardBlock, HWardBlock, WardNo) VALUES (?, ?, ?, ?)',
            [VSId, EWardBlock, HWardBlock, WardNo]
        );

        const AddedCouncil = {
            VSId, EWardBlock, HWardBlock, WardNo
        }
        return res.status(201).json(
            new ApiResponse(200, AddedCouncil, "wardblock details submitted successfully")
        );

    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const WardBlockDetails = asyncHandler(async (req, res) => {

    try {
        const results = await queryDatabase('SELECT WB.Id, WB.VSId, WB.WardNo, WB.EWardBlock, WB.HWardBlock, vidhansabha.EVidhanSabha FROM wardblock AS WB INNER JOIN vidhansabha ON vidhansabha.Id = WB.VSId ORDER BY WB.WardNo ');

        return res.json(results); // Should correctly return the results array
    } catch (error) {
        console.error('Database query error', error);
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateWardBlockDetail = asyncHandler(async (req, res) => {

    const { Id, VSId, WardNo, EWardBlock, HWardBlock } = req.body;
    if (!Id, !VSId || !EWardBlock || !WardNo || !HWardBlock) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        await queryDatabase(
            'UPDATE wardblock SET EWardBlock= ?, HWardBlock= ?, VSId= ?, WardNo=? WHERE Id= ?',
            [EWardBlock, HWardBlock, VSId, WardNo, Id]
        );

        const updatedCouncil = {
            EWardBlock, HWardBlock, VSId, WardNo, Id
        };

        return res.status(201).json(
            new ApiResponse(200, updatedCouncil, "wardblock details Updated successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const DeleteWardBlockDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;


    try {
        await queryDatabase(
            'DELETE FROM wardblock WHERE Id= ?',
            [Id]
        );


        return res.status(201).json(
            new ApiResponse(200, "council details Deleted successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddChakBlock = asyncHandler(async (req, res) => {
    const { ECBPanch, HCBPanch, ChakNo, WBId } = req.body;

    if (!ECBPanch || !HCBPanch || !ChakNo || !WBId)
        throw new ApiError(400, 'Plaese Enter All the Details')


    try {
        await queryDatabase(
            'INSERT INTO chakblockpanch (WBId, ECBPanch, HCBPanch, ChakNo) VALUES (?, ?, ?, ?)',
            [WBId, ECBPanch, HCBPanch, ChakNo]
        );

        const AddedCouncil = {
            WBId, ECBPanch, HCBPanch, ChakNo
        }
        return res.status(201).json(
            new ApiResponse(200, AddedCouncil, "ChakBlock details submitted successfully")
        );

    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const ChakBlockDetails = asyncHandler(async (req, res) => {

    try {
        const results = await queryDatabase('SELECT chakblockpanch.*, wardblock.EWardBlock FROM chakblockpanch INNER JOIN wardblock ON wardblock.Id = chakblockpanch.WBId');

        return res.json(results);
    } catch (error) {
        console.error('Database query error', error);
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateChakBlockDetail = asyncHandler(async (req, res) => {
    console.log(" hariom ", req.body);
    const { Id, WBId, ChakNo, ECBPanch, HCBPanch } = req.body;
    if (!Id, !WBId || !ChakNo || !ECBPanch || !HCBPanch) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        await queryDatabase(
            'UPDATE chakblockpanch SET ECBPanch= ?, HCBPanch= ?, WBId= ?, ChakNo=? WHERE Id= ?',
            [ECBPanch, HCBPanch, WBId, ChakNo, Id]
        );

        const updatedCouncil = {
            ECBPanch, HCBPanch, WBId, ChakNo, Id
        };

        return res.status(201).json(
            new ApiResponse(200, updatedCouncil, "wardblock details Updated successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const DeleteChakBlockDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;
    try {
        await queryDatabase(
            'DELETE FROM chakblockpanch WHERE Id= ?',
            [Id]
        );


        return res.status(201).json(
            new ApiResponse(200, "council details Deleted successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddAreaVill = asyncHandler(async (req, res) => {
    const { EAreaVill, HAreaVill, HnoRange, CBPId } = req.body;



    if (!EAreaVill || !HAreaVill || !CBPId )
        throw new ApiError(400, 'Plaese Enter All the Details')


    try {
        await queryDatabase(
            'INSERT INTO areavill (CBPId, EAreaVill, HAreaVill, HnoRange) VALUES (?, ?, ?,?)',
            [CBPId, EAreaVill, HAreaVill, HnoRange]
        );
        const AddedCouncil = {
            CBPId, EAreaVill, HAreaVill, HnoRange
        }
        return res.status(201).json(
            new ApiResponse(200, AddedCouncil, "Tehsil details submitted successfully")
        );

    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AreaVillDetails = asyncHandler(async (req, res) => {

    try {
        const results = await queryDatabase('SELECT areavill.*, chakblockpanch.ECBPanch, wardblock.EWardBlock, wardblock.Id as WBId FROM areavill INNER JOIN chakblockpanch ON areavill.CBPId = chakblockpanch.id INNER JOIN wardblock ON wardblock.id = chakblockpanch.WBID;');

        return res.json(results); // Should correctly return the results array
    } catch (error) {
        console.error('Database query error', error);
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateAreaVillDetail = asyncHandler(async (req, res) => {
    // counId, EVidhanSabha, HVidhanSabha, VSNo
    const { Id, CBPId, EAreaVill, HAreaVill, HnoRange } = req.body;

    if (!Id, !CBPId || !EAreaVill || !HAreaVill || !HnoRange) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        await queryDatabase(
            'UPDATE areavill SET EAreaVill= ?, HAreaVill= ?, HnoRange =?, CBPId =? WHERE Id= ?',
            [EAreaVill, HAreaVill, HnoRange, CBPId, Id]
        );

        const updatedVS = {
            EAreaVill, HAreaVill, HnoRange, CBPId, Id
        };

        return res.status(201).json(
            new ApiResponse(200, updatedVS, "VidhanSabha details Updated successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const DeleteAreaVillDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;
    console.log(req.body)
    try {
        await queryDatabase(
            'DELETE FROM areavill WHERE Id= ?',
            [Id]
        );


        return res.status(201).json(
            new ApiResponse(200, "areavill details Deleted successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddPSList = asyncHandler(async (req, res) => {
    const { ESPArea, HSPArea, PSNo, ESPName, HSPName, RoomNo } = req.body;
    console.log(req.body);


    if (!ESPArea || !HSPArea || !PSNo || !ESPName || !HSPName || !RoomNo)
        throw new ApiError(400, 'Plaese Enter All the Details')


    try {
        await queryDatabase(
            'INSERT INTO pollingstation (ESPArea, HSPArea, PSNo, ESPName, HSPName, RoomNo) VALUES (?, ?, ?,?, ?,?)',
            [ESPArea, HSPArea, PSNo, ESPName, HSPName, RoomNo]
        );
        const AddedPSList = {
            HSPArea, HSPArea, PSNo, ESPName, HSPName, RoomNo
        }
        return res.status(201).json(
            new ApiResponse(200, AddedPSList, "PSList details submitted successfully")
        );

    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const PSListDetails = asyncHandler(async (req, res) => {

    try {
        const results = await queryDatabase('SELECT * FROM pollingstation')
        return res.json(results);
    } catch (error) {
        console.error('Database query error', error);
        return res.status(500).send('A database error occurred.');
    }
});

const UpdatePSListDetail = asyncHandler(async (req, res) => {

    const { Id, ESPArea, HSPArea, PSNo, ESPName, HSPName, RoomNo } = req.body;

    if (!Id, !ESPArea || !HSPArea || !PSNo || !ESPName || !HSPName || !RoomNo) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        await queryDatabase(
            'UPDATE pollingstation SET ESPArea= ?, HSPArea= ?, PSNo =?, ESPName =?, HSPName=?, RoomNo=? WHERE Id= ?',
            [ESPArea, HSPArea, PSNo, ESPName, HSPName, RoomNo, Id]
        );

        const updatedPSList = {
            Id, ESPArea, HSPArea, PSNo, ESPName, HSPName, RoomNo
        };

        return res.status(201).json(
            new ApiResponse(200, updatedPSList, "PSList details Updated successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const DeletePSListDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;
    try {
        await queryDatabase(
            'DELETE FROM pollingstation WHERE Id= ?',
            [Id]
        );


        return res.status(201).json(
            new ApiResponse(200, "areavill details Deleted successfully")
        );
    } catch (error) {
        console.error('Database query error', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});


const SearchPSNo = asyncHandler(async (req, res) => {
    const { query } = req.body;
    // console.log("Received query:", req.body);
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required', query });
    }
    try {
        const results = await queryDatabase(
            'SELECT PSNo, ESPName, RoomNo FROM pollingstation WHERE PSNo LIKE ?',
            [`%${query}%`]
        );
        
       
        return res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'A database error occurred.' });
    }
});




export {
    AddCaste, casteDetails, UpdateCasteDetail,
    AddTehsil, TehsilDetails, UpdateTehsilDetail, DeleteTehsilDetail,
    AddCouncil, CouncilDetails, UpdateCouncilDetail, DeleteCouncilDetail,
    AddVidhanSabha, VidhanSabhaDetails, UpdateVidhanSabhaDetail, DeleteVidhanSabhaDetail,
    AddWardBlock, WardBlockDetails, UpdateWardBlockDetail, DeleteWardBlockDetail,
    AddChakBlock, ChakBlockDetails, UpdateChakBlockDetail, DeleteChakBlockDetail,
    AddAreaVill, AreaVillDetails, UpdateAreaVillDetail, DeleteAreaVillDetail,
    AddPSList, PSListDetails, UpdatePSListDetail, DeletePSListDetail, SearchPSNo

}


//   array sort 
// intro
// sql - authentication vs authorization
// filter - 