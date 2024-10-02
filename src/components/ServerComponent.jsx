// components/ServerComponent.js
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }
  return session;
}
