import dotenv from "dotenv"
dotenv.config();

import express from "express"
import {router as authrouter} from "./src/routers/authRouter.js"
import {router as taskRouter} from "./src/routers/taskRouter.js"
import {router as categoryRouter} from "./src/routers/categoryRouter.js"

const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use('/api/users', authrouter);
app.use("/api/tasks", taskRouter);
app.use("/api/categories", categoryRouter)

app.listen(process.env.PORT, () => {
	console.log(`Example app listening on port ${process.env.PORT}`)
})