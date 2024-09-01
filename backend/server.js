import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cron from "node-cron";
import cookieParser from "cookie-parser";
import router from "./router/route.js";
import connect from "./database/conn.js";

const app = express();
config();
const corsOptions = {
  origin: process.env.DOMAIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static("public"))

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected to http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);

    process.exit(1);
  });

app.use("/api", router);

app.get("/", (req, res) => {
  res.json("Get Request");
});

cron.schedule("* * * * *", () => {
  console.log("Cron job running every minute");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});
