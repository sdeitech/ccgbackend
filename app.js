import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import DB from "./database/db";
import AuthRoute from "./routes/authRoute"

const app = express();
DB();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
const _dirname = path.resolve();
app.use(bodyParser.json());
app.use(express.static(path.join(_dirname, "public")));

/* Routing  */

app.use('/auth/api',AuthRoute)

app.use((err, req, res, next) => {
    next(err);
});

// Routes
app.use("/", express.static("public"));
export default app;