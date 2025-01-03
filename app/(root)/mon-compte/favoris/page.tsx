import Favoris from "@/components/Profils/Favoris";
import { currentUser } from "@/lib/auth";

import React from "react";

export default async function Fav() {
  const user = await currentUser();
  const userId = user ? user.id : "";

  return (
    <section className="wrapper">
      <Favoris userId={userId} />
    </section>
  );
}
