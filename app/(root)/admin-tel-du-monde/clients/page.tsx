import { getAllUsers } from "@/lib/actions/user.actions";
import React from "react";

export default async function ClientsPage() {
  const users = await getAllUsers();

  console.log("USERS", users);

  return <div className="wrapper">page</div>;
}
