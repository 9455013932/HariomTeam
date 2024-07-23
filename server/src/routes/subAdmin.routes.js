import { Router } from "express"
import { voterList } from "../controllers/subAdmin.controllers.js";


const subAdminRouter = Router()


subAdminRouter.route("/voterList").post(voterList)




export default subAdminRouter;