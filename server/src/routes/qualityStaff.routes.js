import { Router } from "express"
import { sendSMS, wardwiseVoterContact } from "../controllers/qualityStaff.controller.js";


const QualityStaffRouter = Router()

QualityStaffRouter.route("/wardwiseVoterContact").post(wardwiseVoterContact)
QualityStaffRouter.route("/sendSMS").post(sendSMS)

export default QualityStaffRouter;