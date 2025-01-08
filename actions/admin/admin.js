"use server";

export async function checkRole(_address) {
  const admin = process.env.ADMIN;
  return _address.toLowerCase() === admin.toLowerCase();
}
