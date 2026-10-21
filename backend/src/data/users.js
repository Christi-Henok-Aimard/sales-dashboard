import bcrypt from "bcryptjs";

const users = [
  {
    id: 1,
    name: "Admin Demo",
    email: "admin@demo.com",
    role: "admin",
    passwordHash: bcrypt.hashSync("Admin123!", 12),
  },
];

export const findByEmail = (email) =>
  users.find((u) => u.email === email.toLowerCase());

export const findById = (id) => users.find((u) => u.id === id);