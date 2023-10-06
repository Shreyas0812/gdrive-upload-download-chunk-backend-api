import express from "express";
import router from "./api/routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = process.env.PORT || 3007;

app.use('/api/', router)

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})