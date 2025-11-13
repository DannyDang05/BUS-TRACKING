import express from "express";
import authRoute from "./api/v1/authRoute.js";
import driverRoute from "./api/v1/driverRoute.js";
import studentRoute from "./api/v1/studentRoute.js";
import trackingRoute from "./api/v1/trackingRoute.js";

const router = express.Router();

const initAPIRouter = (app) => {
  
  // Gắn các module vào router v1
  router.use("/v1/auth", authRoute);
  router.use("/v1/drivers", driverRoute);
  router.use("/v1/students", studentRoute);
  router.use("/v1/tracking", trackingRoute);

  // Gắn Router tổng vào Express app với prefix /api
  return app.use("/api", router);
};

export default initAPIRouter;