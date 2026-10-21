import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { findByEmail, findById } from "../data/users.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Trop de tentatives, réessayez dans 15 minutes" },
});

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 60 * 60 * 1000,
});

// Hash factice pour éviter de révéler si l'email existe (timing)
const DUMMY_HASH = bcrypt.hashSync("dummy-password", 12);

router.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }

  const { email, password } = parsed.data;
  const user = findByEmail(email);
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !valid) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, cookieOptions());
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.get("/me", requireAuth, (req, res) => {
  const user = findById(req.user.id);
  if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

router.post("/logout", (req, res) => {
  const { maxAge, ...opts } = cookieOptions();
  res.clearCookie("token", opts);
  res.json({ message: "Déconnecté" });
});

export default router;