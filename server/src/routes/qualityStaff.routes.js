import { Router } from "express"
import { employeeDetails, sendSMS, wardwiseVoterContact } from "../controllers/qualityStaff.controller.js";


const QualityStaffRouter = Router()

QualityStaffRouter.route("/wardwiseVoterContact").post(wardwiseVoterContact)
QualityStaffRouter.route("/sendSMS").post(sendSMS)
QualityStaffRouter.route("/employeeDetails").get(employeeDetails)
// QualityStaffRouter.route("/addemployeeData").post(addemployeeData)

export default QualityStaffRouter;