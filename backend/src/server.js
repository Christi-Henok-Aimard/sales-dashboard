import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import salesRoutes from "./routes/sales.js";
import { requireAuth } from "./middleware/auth.js";

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET manquant dans le fichier .env");
  process.exit(1);
}

const app = express();

// Nécessaire derrière un hébergeur (Render) pour les IP et les cookies sécurisés
app.set("trust proxy", 1);

app.use(helmet());
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/sales", requireAuth, salesRoutes);

app.use((req, res) => res.status(404).json({ message: "Route introuvable" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API démarrée sur http://localhost:${PORT}`));