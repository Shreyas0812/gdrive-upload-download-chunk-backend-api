import { Router } from "express";

const router = Router();

router.use('/', () => {
    console.log("inside routes")
})

export default router;
