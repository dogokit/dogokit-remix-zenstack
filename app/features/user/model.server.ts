import type { User } from "@prisma/client";

import { prisma } from "~/libs/db.server";
import { hashPassword, verifyPassword } from "~/libs/password.server";

export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await hashPassword(password);

  const data = {
    email,
    password: hashedPassword,
  };

  return prisma.user.create({ data });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(email: User["email"], password: string) {
  const userWithPassword = await prisma.user.findUnique({ where: { email } });
  if (!userWithPassword || !userWithPassword.password) return null;

  const isValid = await verifyPassword(password, userWithPassword.password);
  if (!isValid) return null;

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
