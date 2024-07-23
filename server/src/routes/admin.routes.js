import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import {
        AddCaste, casteDetails, UpdateCasteDetail,
        AddTehsil, TehsilDetails, UpdateTehsilDetail, DeleteTehsilDetail,
        AddCouncil, CouncilDetails, UpdateCouncilDetail, DeleteCouncilDetail,
        AddVidhanSabha, VidhanSabhaDetails, UpdateVidhanSabhaDetail, DeleteVidhanSabhaDetail,
        AddWardBlock, WardBlockDetails, UpdateWardBlockDetail, DeleteWardBlockDetail,
        AddChakBlock, ChakBlockDetails, UpdateChakBlockDetail, DeleteChakBlockDetail,
        AddAreaVill, AreaVillDetails, UpdateAreaVillDetail, DeleteAreaVillDetail,
        AddPSList, PSListDetails, UpdatePSListDetail, DeletePSListDetail,
        SearchPSNo,

}
        from "../controllers/admin.controllers.js";


const AdminRouter = Router()



AdminRouter.route("/addCaste").post(AddCaste)
AdminRouter.route("/casteDetails").get(casteDetails)
AdminRouter.route("/updateCasteDetail").post(UpdateCasteDetail)

AdminRouter.route("/addTehsil").post(AddTehsil)
AdminRouter.route("/tehsilDetails").get(TehsilDetails)
AdminRouter.route("/updateTehsilDetail").post(UpdateTehsilDetail)
AdminRouter.route("/deleteTehsilDetail").post(DeleteTehsilDetail)

AdminRouter.route("/addCouncil").post(AddCouncil)
AdminRouter.route("/councilDetails").get(CouncilDetails)
AdminRouter.route("/updateCouncilDetail").post(UpdateCouncilDetail)
AdminRouter.route("/deleteCouncilDetail").post(DeleteCouncilDetail)

AdminRouter.route("/addVidhanSabha").post(AddVidhanSabha)
AdminRouter.route("/vidhanSabhaDetails").get(VidhanSabhaDetails)
AdminRouter.route("/updateVidhanSabhaDetail").post(UpdateVidhanSabhaDetail)
AdminRouter.route("/deleteVidhanSabhaDetail").post(DeleteVidhanSabhaDetail)

AdminRouter.route("/addWardBlock").post(AddWardBlock)
AdminRouter.route("/wardBlockDetails").get(WardBlockDetails)
AdminRouter.route("/updateWardBlockDetails").post(UpdateWardBlockDetail)
AdminRouter.route("/deleteWardBlockDetail").post(DeleteWardBlockDetail)

AdminRouter.route("/addChakBlock").post(AddChakBlock)
AdminRouter.route("/chakBlockDetails").get(ChakBlockDetails)
AdminRouter.route("/updateChakBlockDetail").post(UpdateChakBlockDetail)
AdminRouter.route("/deleteChakBlockDetail").post(DeleteChakBlockDetail)

AdminRouter.route("/addAreaVill").post(AddAreaVill)
AdminRouter.route("/areaVillDetails").get(AreaVillDetails)
AdminRouter.route("/updateAreaVillDetail").post(UpdateAreaVillDetail)
AdminRouter.route("/deleteAreaVillDetail").post(DeleteAreaVillDetail)


AdminRouter.route("/addPSList").post(AddPSList)
AdminRouter.route("/pSListDetails").get(PSListDetails)
AdminRouter.route("/updatePSListDetail").post(UpdatePSListDetail)
AdminRouter.route("/deletePSListDetail").post(DeletePSListDetail)
AdminRouter.route("/searchPSNo").post(SearchPSNo)



export default AdminRouter;