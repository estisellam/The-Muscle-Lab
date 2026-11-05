import express from "express";
import { createCorsOptions } from "./config/cors.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import membershipPlanRoutes from "./routes/membershipPlanRoutes.js";
import userMembershipRoutes from "./routes/userMembershipRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import trainerRoutes from "./routes/trainerRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
app.disable("x-powered-by");

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// middlewares
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    next();
});
app.use(cors(createCorsOptions()));
app.use(express.json());


app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);
app.use(
    "/api/membership-plans",
    membershipPlanRoutes
);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(
    "/api/user-memberships",
    userMembershipRoutes
);
app.use(
    "/api/classes",
    classRoutes
);
app.use("/api/trainers", trainerRoutes);
app.use("/api/dashboard", dashboardRoutes);
// Keep parser/upload failures JSON-shaped for the fetch client.
app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 :
        error.name === "MulterError" ? 400 : error.status || 500;
    res.status(status).json({ message: status >= 500 ? "Internal server error" : error.message });
});
export default app;