import { Router } from "express";
import gdriveUploadDownloadRouter from "./pages/gdriveUploadDownload/gdriveUploadDownload.routes.js";

const router = Router();

router.use('/gdriveUD', gdriveUploadDownloadRouter)

export default router;
