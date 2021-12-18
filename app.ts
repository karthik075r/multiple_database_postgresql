import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import user from "./src/api/user/routers";
import manufacture from "./src/api/manufacture/routers";

dotenv.config();

const app = express();
app.use(express.json());

// Port Number
const port = process.env.PORT || 1919;

app.use(
  cors({
    exposedHeaders: ["Content-Disposition"],
  })
);

// Morgan Middleware for logging
// app.use(morgan("dev"));

// // Body Parser Middleware
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(bodyParser.json({ limit: "100mb" }));

//TestRoute
app.post("/test", (req, res) => {
  res
    .status(200)
    .send({ message: "Testcase Successfully completed", data: req.body });
});
app.use("/api", user);
app.use("/api", manufacture);

// Index Route
app.get("/", (req, res) => {
  res.status(404).send("Invalid Endpoint");
});

app.get("*", (req, res) => {
  res.status(404).send("Invalid Endpoint");
});

let appListenCallBack = async () => {
  try {
    // await AdminSetupService.create().setup()
    console.log("Server started on port " + port);
  } catch (error) {
    console.log("Server started on port " + port + " with error " + error);
  }
};

app.listen(port, appListenCallBack);
