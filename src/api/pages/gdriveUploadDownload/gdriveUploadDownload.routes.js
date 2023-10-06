import { Router } from "express";
import { uploadTextFiles } from "./gdriveUploadDownload.controller.js";

const router = Router();

router  
    .route('/')
    .get((req, res) => {
        res.send("INSIDE: API --> GDDRIVEUD")
    })

router
    .route('/uploadTextFile')
    .post(uploadTextFiles)


export default router;