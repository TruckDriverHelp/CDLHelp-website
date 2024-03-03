import React, { useEffect, useState } from "react";
import cookie from "js-cookie";

const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consentCookie = cookie.get("cookieConsent");

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

  if (!showBanner) {
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
       <p style={{color: "#000000"}}>This website uses cookies to improve your browsing experience</p>
       
        <div style={{
          display: "flex",
          justifyContent: "space-between",
        }}>
          <button onClick={handleAccept} className="default-btn" style={{marginRight: "20px"}}>Accept</button>
          <button onClick={handleReject} className="default-btn">Reject</button>
        </div>
    </div>
  );
};

export default CookieConsentBanner;
