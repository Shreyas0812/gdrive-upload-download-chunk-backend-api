import { Router } from "express";
import { getUpload } from "./gdriveUploadDownload.controller.js";

const router = Router();

router  
    .route('/')
    .get((req, res) => {
        res.send("api -> gdrive")
    })

router
    .route('/upload')
    .get(getUpload)

export default router;