import express from "express";
import authRoute from "./authRoute.js";
import driverRoute from "./driverRoute.js";
import studentRoute from "./studentRoute.js";
import trackingRoute from "./trackingRoute.js";
import routeRoute from "./routeRoute.js";
import vehicleRoute from "./vehicleRoute.js";
import notificationRoute from "./notificationRoute.js";
import pickuppointRoute from "./pickuppointRoute.js";

const router = express.Router();

const initAPIRouter = (app) => {
  
  // Gắn các module vào router v1
  router.use("/v1/auth", authRoute);
  router.use("/v1/drivers", driverRoute);
  router.use("/v1/students", studentRoute);
  router.use("/v1/tracking", trackingRoute);
  router.use("/v1/routes", routeRoute);
  router.use("/v1/vehicles", vehicleRoute);
  router.use("/v1/pickuppoints", pickuppointRoute);
  router.use("/v1/notifications", notificationRoute);

  // Gắn Router tổng vào Express app với prefix /api
  return app.use("/api", router);
};

export default initAPIRouter;