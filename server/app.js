import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import membershipPlanRoutes from "./routes/membershipPlanRoutes.js";
import userMembershipRoutes from "./routes/userMembershipRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// middlewares
app.use(cors());
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
export default app;