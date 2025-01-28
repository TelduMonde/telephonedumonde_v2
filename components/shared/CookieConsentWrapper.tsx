/* eslint-disable react/no-unescaped-entities */
"use client";

import CookieConsent from "react-cookie-consent";

export default function CookieConsentWrapper() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Je comprends"
      declineButtonText="Je refuse"
      cookieName="myAwesomeCookieName2"
      style={{
        background: "#9e0906",
        maxHeight: "50px",
        display: "flex",
        alignItems: "center",
        fontSize: "12px",
      }}
      buttonStyle={{
        color: "#fff",
        background: "#2a2a2a",
        fontSize: "10px",
        borderRadius: "5px",
      }}
      declineButtonStyle={{
        color: "#fff",
        background: "#0a0a0a",
        fontSize: "10px",
        borderRadius: "5px",
      }}
      expires={150}
      // enableDeclineButton
    >
      Ce site utilise des cookies pour améliorer l'expérience utilisateur.{" "}
      <span style={{ fontSize: "8px" }}>En savoir plus</span>
    </CookieConsent>
  );
}
