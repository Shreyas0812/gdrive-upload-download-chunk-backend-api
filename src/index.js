import express from "express";
import router from "./api/routes.js";

const app = express();

app.use('/api/', router)

app.listen(3001, () => {
    console.log('Server started on port 3001')
})