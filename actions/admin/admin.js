"use server";

export async function checkRole(_address) {
  const admin = process.env.ADMIN;
  if (_address.toLowerCase() !== admin.toLowerCase()) return false;
  return true;
}
