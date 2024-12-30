/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useTransition, useRef } from "react";
import emailjs from "@emailjs/browser";
import { BottomGradient } from "../ui/BottomGradient";

export const ContactForm = () => {
  const formulaire = useRef<HTMLFormElement>(null);

  const [confirmationMessage, setConfirmationMessage] = useState("");

  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: "",
    object: "",
    mail: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = (e: any) => {
    e.preventDefault();

    startTransition(() => {
      emailjs
        .sendForm("service_vdz9g1i", "template_as6vs2f", e.currentTarget, {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        })
        .then(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (result) => {
            setForm({
              name: "",
              object: "",
              mail: "",
              message: "",
            });
            setConfirmationMessage("Email envoyé avec succès !");
            setTimeout(() => {
              setConfirmationMessage("");
            }, 10000);
          },
          (error: any) => {
            console.log("FAILED...", error.text);
          }
        );
    });
  };

  return (
    <form
      ref={formulaire}
      onSubmit={sendEmail}
      className="w-full sm:w-1/2 flex flex-col gap-4 "
    >
      {confirmationMessage && (
        <p className="text-white bg-emerald-400 p-4 rounded-sm font-font1 text-center">
          {confirmationMessage}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-white font-font1">Nom & Prénom</label>
          <input
            type="text"
            name="name"
            placeholder="Jean Dupont"
            onChange={handleChange}
            value={form.name}
            required
            minLength={2}
            maxLength={30}
            className="p-1 rounded-md placeholder:text-xs"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-white font-font1">Email</label>
          <input
            type="text"
            name="mail"
            placeholder="telephone@monde.com"
            onChange={handleChange}
            value={form.mail}
            required
            minLength={2}
            maxLength={40}
            className="p-1 rounded-md placeholder:text-xs"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-white font-font1">Objet</label>
          <input
            type="text"
            name="object"
            placeholder=""
            onChange={handleChange}
            value={form.object}
            required
            minLength={2}
            maxLength={30}
            className="p-1 rounded-md placeholder:text-xs"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white font-font1">Message</label>
        <textarea
          name="message"
          placeholder="Ecrire votre message ici..."
          onChange={handleChange}
          value={form.message}
          required
          minLength={2}
          maxLength={350}
          className="font-font1 text-dark dark:text-dark bg-grey-50 flex flex-1 placeholder:text-grey-500 placeholder:text-xs p-regular-16 px-5 py-3 border-none focus-visible:ring-transparent rounded-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full lg:w-2/4 mx-auto bg-gradient-to-t px-2 relative group/btn from-primary-900  to-primary-500 block text-white rounded-md h-10 font-bold font-font1 uppercase tracking-widest"
      >
        {isPending ? "Envoie..." : "Envoyer"}
        <BottomGradient />
      </button>
    </form>
  );
};
