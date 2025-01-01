import React from "react";

export default function page() {
  return (
    <section className="wrapper flex flex-col gap-10">
      <h1 className="flex items-center gap-4 sm:mt-2 font-font1 text-white text-base sm:text-4xl font-extrabold tracking-wide">
        LE CONCEPT{" "}
        <span className="text-xl font-thin font-fontb text-center inline-block p-4 border rounded-md text-white tracking-widest">
          Téléphone du monde
        </span>
      </h1>
      <div className="h-[1px] w-2/3 bg-gradient-to-r from-white to-noir-900" />
    </section>
  );
}
