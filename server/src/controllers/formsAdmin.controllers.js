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

const AddOutForm = asyncHandler(async (req, res) => {
    const {
        VMob1,
        VMob2,
        VEName,
        VHName,
        VEAddress,
        VHAddress,
        NoOfForms,
        SendingDate,
        ERemarks,
        CMob1,
        CEName,
        CHName
    } = req.body;


    try {
        let volunteer = await queryDatabase(
            'SELECT Id FROM volunteer WHERE VMob1 = ?',
            [VMob1]
        );

        let volunteerId;
        if (volunteer.length > 0) {
            // Update existing volunteer
            volunteerId = volunteer[0].Id;
            await queryDatabase(
                `UPDATE volunteer SET VEName = ?, VHName = ?, VEAddress = ?, VHAddress = ? WHERE id = ?`,
                [VEName, VHName, VEAddress, VHAddress, volunteerId]
            );
        } else {
            // Insert new volunteer
            const result = await queryDatabase(
                'INSERT INTO volunteer (VMob1, VMob2, VEName, VHName, VEAddress, VHAddress) VALUES (?, ?, ?, ?, ?, ?)',
                [VMob1, VMob2, VEName, VHName, VEAddress, VHAddress]
            );
            volunteerId = result.insertId;
        }



        let volunteer2 = await queryDatabase(
            'SELECT Id FROM volunteer WHERE VMob1 = ?',
            [CMob1]
        );

        let volunteerId2;
        if (volunteer2.length > 0) {
            volunteerId2 = volunteer2[0].Id;
            await queryDatabase(
                `UPDATE volunteer SET VEName = ?, VHName = ? WHERE id = ?`,
                [CEName, CHName, volunteerId2]
            );
        } else {
          
            const result = await queryDatabase(
                'INSERT INTO volunteer (VMob1, VEName, VHName) VALUES (?, ?, ?)',
                [CMob1, CEName, CHName]
            );
            volunteerId2 = result.insertId;
        }

        

   

        await queryDatabase(
            `INSERT INTO outgoingform (
                RefId,  ERemark, SendingDate, NoOfForms, COID
            ) VALUES (?, ?, ?, ?, ?)`,
            [volunteerId, ERemarks, SendingDate, NoOfForms,volunteerId2 ]
        );

        res.status(201).json(
            new ApiResponse(200, "OF details submitted successfully")
        );
    } catch (error) {
        console.error('Error in adding Ougoing form forms:', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const OutFormDetails = asyncHandler(async (req, res) => {

    try {
        const OutForms = await queryDatabase(`
        SELECT v1.VEName AS RName, V1.VMob1 AS RMob1, v1.VEAddress AS RAddress,
        v2.VEName AS C1Name, V2.VMob1 as C1Mob,
        O.SendingDate, O.ERemark, O.NoOfForms
        FROM outgoingform AS O
        LEFT JOIN volunteer AS v1 ON O.RefId = v1.Id
        LEFT JOIN volunteer AS v2 ON O.COId = v2.Id
      
        `);
        return res.json(OutForms);
        // res.status(200).json(new ApiResponse(200, incomingForms, "Fetched all Outgoing forms successfully"));
    } catch (error) {
        console.error('Error in fetching incoming forms:', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddIncomForm = asyncHandler(async (req, res) => {
    const {
        VMob1,
        VMob2,
        VEName,
        VHName,
        VEAddress,
        VHAddress,
        NFormsKN,
        NFormsKd, 
        NFormsU,
        PacketNo,
        ReceivedDate,
        ERemarks,
        COList
    } = req.body;

    try {
        let volunteer = await queryDatabase(
            'SELECT Id FROM volunteer WHERE VMob1 = ?',
            [VMob1]
        );

        let volunteerId;
        if (volunteer.length > 0) {
            volunteerId = volunteer[0].Id;
            await queryDatabase(
                `UPDATE volunteer SET VEName = ?, VHName = ?, VEAddress = ?, VHAddress = ? WHERE Id = ?`,
                [VEName, VHName, VEAddress, VHAddress, volunteerId]
            );
        } else {
            const result = await queryDatabase(
                'INSERT INTO volunteer (VMob1, VMob2, VEName, VHName, VEAddress, VHAddress) VALUES (?, ?, ?, ?, ?, ?)',
                [VMob1, VMob2, VEName, VHName, VEAddress, VHAddress]
            );
            volunteerId = result.insertId;
        }

        let insertedCareOfIds = [];

        if (COList && Array.isArray(COList) && COList.length > 0) {
            const careOfQueries = COList.map(async (co) => {
                let careOfVolunteer = await queryDatabase(
                    'SELECT Id FROM volunteer WHERE VMob1 = ?',
                    [co.VMob1]
                );

                let careOfId;
                if (careOfVolunteer.length > 0) {
                    careOfId = careOfVolunteer[0].Id;
                    await queryDatabase(
                        `UPDATE volunteer SET VEName = ?, VHName = ? WHERE Id = ?`,
                        [co.VEName, co.VHName, careOfId]
                    );
                } else {
                    const careOfResult = await queryDatabase(
                        'INSERT INTO volunteer (VMob1, VEName, VHName, COId) VALUES (?, ?, ?, ?)',
                        [co.VMob1, co.VEName, co.VHName, volunteerId]
                    );
                    careOfId = careOfResult.insertId;
                }
                return careOfId;
            });

            insertedCareOfIds = await Promise.all(careOfQueries);
        }

        const careOfValues = insertedCareOfIds.slice(0, 3); 

        while (careOfValues.length < 3) {
            careOfValues.push(null);
        }

        await queryDatabase(
            `INSERT INTO incomingform (
                RefId, PacketNo, ERemarks, ReceivedDate, NFormsKN, NFormsKd, NFormsU,
                COID1, COID2, COID3
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [volunteerId, PacketNo, ERemarks, ReceivedDate, NFormsKN, NFormsKd, NFormsU, ...careOfValues]
        );

        res.status(201).json(
            new ApiResponse(200, "IF details submitted successfully")
        );
    } catch (error) {
        console.error('Error in adding incoming forms:', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const UpdateIncomForm = asyncHandler(async (req, res) => {
    const {
        VMob1,
        VMob2,
        VEName,
        VHName,
        VEAddress,
        VHAddress,
        NFormsKN,
        NFormsKd, 
        NFormsU,
        PacketNo,
        ReceivedDate,
        ERemarks,
        COList
    } = req.body;

    try {
      
        let volunteer = await queryDatabase(
            'SELECT Id FROM volunteer WHERE VMob1 = ?',
            [VMob1]
        );

        let volunteerId;
        if (volunteer.length > 0) {
            // Update existing volunteer
            volunteerId = volunteer[0].Id;
            await queryDatabase(
                `UPDATE volunteer SET VEName = ?, VHName = ?, VEAddress = ?, VHAddress = ? WHERE id = ?`,
                [VEName, VHName, VEAddress, VHAddress, volunteerId]
            );
        } 

        let insertedCareOfIds = [];

        if (COList && Array.isArray(COList) && COList.length > 0) {
            const careOfQueries = COList.map(async (co) => {
                let careOfVolunteer = await queryDatabase(
                    'SELECT Id FROM volunteer WHERE VMob1 = ?',
                    [co.VMob1]
                );

                let careOfId;
                if (careOfVolunteer.length > 0) {
                    // Update existing care_of volunteer
                    careOfId = careOfVolunteer[0].Id;
                    await queryDatabase(
                        `UPDATE volunteer SET VEName = ?, VHName = ? WHERE Id = ?`,
                        [co.VEName, co.VHName, careOfId]
                    );
                }

               
                return careOfId;
            });

            insertedCareOfIds = await Promise.all(careOfQueries);
        }

        const careOfValues = insertedCareOfIds.slice(0, 3); 

        while (careOfValues.length < 3) {
            careOfValues.push(null);
        }


        await queryDatabase(
            `UPDATE incomingform SET
                RefId= ?, ERemarks= ?, ReceivedDate= ?, 
                COID1= ?, COID2= ?, COID3= ?,
                NFormsKN= ?, NFormsKd= ?, NFormsU= ?
                WHERE PacketNo= ?`,
            [volunteerId, ERemarks, ReceivedDate, ...careOfValues, NFormsKN, NFormsKd, NFormsU, PacketNo]
        );

        res.status(201).json(
            new ApiResponse(200, "IF details Updated successfully")
        );
    } catch (error) {
        console.error('Error in adding incoming forms:', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const incomFormDetails = asyncHandler(async (req, res) => {

    try {
        const incomingForms = await queryDatabase(`
        SELECT v1.Id As IncRefId, v1.VEName AS RName, V1.VHName AS RHName, V1.VMob1 AS RMob1, v1.VEAddress AS RAddress, V1.VHAddress AS RHAddress,
        i.Id, i.PacketNo, i.NFormsKN,  i.NFormsKd, i.NFormsU, i.ReceivedDate, i.ERemarks,
        v2.VEName AS C1Name,v2.VHName AS C1HName, V2.VMob1 as C1Mob, 
        v3.VEName AS C2Name, v3.VHName AS C2HName, V3.VMob1 as C2Mob, 
        v4.VEName AS C3Name, v4.VHName AS C3HName, V4.VMob1 as C3Mob
        FROM incomingform AS i
        LEFT JOIN volunteer AS v1 ON i.RefId = v1.Id
        LEFT JOIN volunteer AS v2 ON i.COId1 = v2.Id
        LEFT JOIN volunteer AS v3 ON i.COId2 = v3.Id
        LEFT JOIN volunteer AS v4 ON i.COId3 = v4.Id
        ORDER BY i.PacketNo
        `);
        return res.json(incomingForms);
        // res.status(200).json(new ApiResponse(200, incomingForms, "Fetched all incoming forms successfully"));
    } catch (error) {
        console.error('Error in fetching incoming forms:', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});


const SearchVMobNo = asyncHandler(async (req, res) => {
    const { query } = req.body;
    // console.log("Received query:", req.body);
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required', query });
    }
    try {
        const results = await queryDatabase(
            `SELECT VMob1, VMob2, VEName, VHName, VEAddress, VHAddress 
            FROM volunteer 
            WHERE VMob1 LIKE ?`,
            [`%${query}%`]
        );


        return res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'A database error occurred.' });
    }
});

const FormsAdminInfo= asyncHandler(async (req, res) => {
    try {
        const result = await queryDatabase(`
        SELECT 
        (SELECT SUM(NFormsKN) + sum(NFormsKd) + sum(NFormsU) FROM incomingform) AS totalIncomingForms,
        (SELECT SUM(NoOFForms) FROM outgoingform) AS totalOutgoingForms;
    
        `);

        if (result.length > 0) {
            return res.json(result[0]); 
        } else {
            return res.json({ totalIncomingForms: 0, totalOutgoingForms: 0 });
        }

       
        
    } catch (error) {
        console.error('Error in fetching incoming forms:', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }


})

export {
    SearchVMobNo,
    AddOutForm, OutFormDetails,
    AddIncomForm, UpdateIncomForm, incomFormDetails,
    FormsAdminInfo
};
