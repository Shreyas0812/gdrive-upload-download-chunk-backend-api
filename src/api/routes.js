import { Router } from "express";
import gdriveUploadDownloadRouter from "./pages/gdriveUploadDownload/gdriveUploadDownload.routes.js";

const router = Router();

router.use('/gdrive', gdriveUploadDownloadRouter)

export default router;
