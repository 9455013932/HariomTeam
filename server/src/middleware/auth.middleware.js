import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { queryDatabase } from "../utils/queryDatabase.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Extract token from cookies or authorization header
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
        // Verify token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await getUserFromDatabase(decodedToken.userid);

        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }
        // Attach user to request object
        req.user = user;
        console.log(req.user);
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

const getUserFromDatabase = async (userId) => {
    try {
        const results = await queryDatabase('SELECT userid, name, mobile1, permissionaccess, email, role FROM usersadminformsdata WHERE userid = ?', [userId]);
        if (results.length > 0) {
            return results[0];
        } else {
            return null; 
        }
    } catch (error) {
        console.error('Database query error:', error);
        throw new ApiError(500, "Database query failed");
    }
};
