import express, { query } from "express";
import router from "./api/routes.js";
import dotenv from "dotenv";
import { google } from "googleapis";
import fs from "fs";

dotenv.config();

const app = express();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

try {
    const credentials = fs.readFileSync("creds.json");
    oauth2Client.setCredentials(JSON.parse(credentials));
} catch (err) {
    console.log("No Creds Found")
}

app.get('/auth/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile", 
            "https://www.googleapis.com/auth/drive"
        ]
    });
    res.redirect(url);
})

app.get('/google/redirect', async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync("creds.json", JSON.stringify(tokens));
    res.send({
        "message": "success"
    });
})

app.get('/saveText/:sometext', async (req, res) => {
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const content = req.params.sometext;

    const driveRes = await drive.files.create({
        requestBody: {
            name: "testTXT.txt",
            mimeType: "text/plain"
        },
        media: {
            mimeType: "text/plain",
            body: content
        }
    })

    // console.log(driveRes);
    res.send({
        "message": "text File Uploaded Successfully"
    });
})

app.get('/saveImage', async (req, res) => {
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const driveRes = await drive.files.create({
        requestBody: {
            name: "testIMG.jpg",
            mimeType: "image/jpeg"
        },
        media: {
            mimeType: "image/jpeg",
            body: fs.createReadStream("image.jpg")
        }
    })

    // console.log(driveRes);
    res.send({
        "message": "Image Uploaded Successfully"
    });
})

app.get('/saveVideo', async (req, res) => {
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const driveRes = await drive.files.create({
        requestBody: {
            name: "testMP4.mp4",
            mimeType: "video/mp4"
        },
        media: {
            mimeType: "video/mp4",
            body: fs.createReadStream("running_freepik.mp4")
        }
    })

    // console.log(driveRes);
    res.send({
        "message": "Video Uploaded Successfully"
    });
})

app.get('/downloadVideo/:fileId', async (req, res) => {
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const fileId = req.params.fileId;

    const driveRes = await drive.files.get({
        fileId: fileId,
        alt: 'media'
    })

    const blob = driveRes.data;
    // Convert the Blob to a Buffer
    const arrayBuffer = await blob.arrayBuffer();
    const videoBuffer = Buffer.from(arrayBuffer);

    const filePath = 'video.mp4';

    fs.writeFileSync(filePath, videoBuffer);

    res.send({
        "message": "Video Downloaded Successfully"
    });
})

app.get('/fileDetails', async (req, res) => {
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const files = [];

    const driveRes = await drive.files.list({
        q: 'mimeType=\'video/mp4\'',
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive'
    })

    Array.prototype.push.apply(files, driveRes.files);

    driveRes.data.files.forEach(file => {
        console.log('Found File: ', file.name, file.id);
    });;

    res.send({
        "message": "File List Fetched Successfully",
        "list": driveRes.data.files
    });
})

const port = process.env.PORT || 3007;

app.use('/api/', router)

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})