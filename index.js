import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import cors from "cors"

dotenv.config()

//importing routes
import userRoutes from "./routes/user.js"
import courseRoutes from "./routes/course.js"
import adminRoutes from "./routes/admin.js"

const app = express();
const port = process.env.PORT;

//using middleware for the reading body data
app.use(express.json());
app.use(cors());

app.get('/', (req, res) =>  {
    res.send(`the server is running`);
})
app.use("/uplodes", express.static("uplodes"));


//using routes
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', adminRoutes);

app.listen(port, () =>  {
    console.log(`server is running at http://localhost:${port}`);
    connectDb();
})