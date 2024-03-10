import React, { useEffect, useState } from "react";
import cookie from "js-cookie";
import { useRouter } from "next/router";

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [texts, setTexts] = useState(null);
  const {locale} = useRouter();

  useEffect(() => {
    const consentCookie = cookie.get("cookieConsent");
    fetch(`http://146.190.47.164:1337/api/cookie-banner?locale=${locale}`)
    .then(response => response.json())
    .then(data => {
        setTexts(data.data.attributes);
    })
    .catch(error => {
        console.error('Error fetching text data:', error);
    })

    if (!consentCookie) {
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

  if (!showBanner || !texts) {
    return null;
  }

  return (
    <div className="bg-light" style={{
      bottom: "0",
      right: "10%", // sorry
      position: "fixed",
      zIndex: "99",
      padding: "30px 50px",
      width: "80%",
      margin: "0 auto",
      textAlign: "center",
      borderTop: "2px solid #75759E",
      borderRight: "2px solid #75759E",
      borderLeft: "2px solid #75759E",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
       <p style={{color: "#000000"}}>{texts.Text}</p>
       
        <div style={{
          display: "flex",
          justifyContent: "space-between",
        }}>
          <button onClick={handleAccept} className="default-btn" style={{marginRight: "20px"}}>{texts.Accept}</button>
          <button onClick={handleReject} className="default-btn">{texts.Decline}</button>
        </div>
    </div>
  );
};

export default CookieConsentBanner;
