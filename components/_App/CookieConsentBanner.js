import React, { useEffect, useState } from "react";
import cookie from "js-cookie";
import { useRouter } from "next/router";

const localeContent = {
  "ru": {
    text: "Мы используем файлы cookie для улучшения вашего опыта на нашем сайте. Продолжая использовать наш сайт, вы соглашаетесь с использованием файлов cookie",
    accept: "Принять",
    deny: "Отклонить"
  },

  "en": {
    text: "We use cookies to enhance your experience on our website. By continuing to use our site, you agree to our use of cookies",
    accept: "Accept",
    deny: "Deny"
  },

  "uk": {
    text: "Ми використовуємо файли cookie для покращення вашого досвіду на нашому вебсайті. Продовжуючи використовувати наш сайт, ви погоджуєтеся з використанням файлів cookie",
    accept: "Прийняти",
    deny: "Відхилити"
  }
}

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const {locale} = useRouter();

  const {text, accept, deny} = localeContent[locale];

  useEffect(() => {
    const consentCookie = cookie.get("cookieConsent");

    if (consentCookie) {
      setShowBanner(false);
    }
    else{
      setShowBanner(true);
    }
}, []);

  const handleAccept = () => {
    setShowBanner(false);
    cookie.set("cookieConsent", "accepted", { expires: 365 });
  };

  const handleReject = () => {
    setShowBanner(false);
    cookie.set("cookieConsent", "rejected", { expires: 365 });
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="bg-light" style={{
      bottom: "0",
      right: "10%", // sorry
      position: "fixed",
      zIndex: "99",
      padding: "10px 10px",
      width: "80%",
      margin: "0 auto",
      borderTop: "2px solid #75759E",
      borderRight: "2px solid #75759E",
      borderLeft: "2px solid #75759E",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
       <p style={{color: "#000000"}}>{text}</p>
       
        <div style={{
          display: "flex",
          justifyContent: "space-between",
        }}>
          <button onClick={handleAccept} className="default-btn" style={{marginRight: "20px"}}>{accept}</button>
          <button onClick={handleReject} className="default-btn">{deny}</button>
        </div>
    </div>
  );
};

export default CookieConsentBanner;
