import React, { useEffect } from 'react';
import Script from 'next/script';
import crypto from 'crypto';

/**
 * Facebook Pixel with Advanced Matching
 * Implements latest 2024 best practices for enhanced match rates
 */
const FacebookPixelAdvanced = () => {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  /**
   * Hash user data using SHA-256 for Advanced Matching
   * Meta requires SHA-256 hashing for PII data
   */
  const hashValue = (value) => {
    if (!value) return undefined;
    
    // Normalize: lowercase, trim, remove spaces
    const normalized = value.toString().toLowerCase().trim().replace(/\s+/g, '');
    
    // Client-side hashing
    if (typeof window !== 'undefined') {
      // Use Web Crypto API if available
      if (window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(normalized);
        return window.crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        });
      }
      
      // Fallback to CryptoJS if loaded
      if (window.CryptoJS) {
        return window.CryptoJS.SHA256(normalized).toString();
      }
    }
    
    // Server-side hashing (Next.js SSR)
    if (typeof window === 'undefined' && crypto) {
      return crypto.createHash('sha256').update(normalized).digest('hex');
    }
    
    return undefined;
  };

  /**
   * Normalize phone number to E.164 format
   * Required for Meta Advanced Matching
   */
  const normalizePhone = (phone) => {
    if (!phone) return undefined;
    
    // Remove all non-numeric characters
    let normalized = phone.replace(/\D/g, '');
    
    // Add country code if missing (assuming US)
    if (normalized.length === 10) {
      normalized = '1' + normalized;
    }
    
    // Add + prefix for E.164 format
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized;
    }
    
    return normalized;
  };

  /**
   * Get user data from various sources
   * Priority: 1. Data Layer, 2. Local Storage, 3. Session Storage, 4. Cookies
   */
  const getUserData = () => {
    const userData = {};

    // Try to get from data layer first (most reliable)
    if (typeof window !== 'undefined' && window.dataLayer) {
      const dlUser = window.dataLayer.find(item => item.user)?.user || {};
      Object.assign(userData, dlUser);
    }

    // Try localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = {
        email: localStorage.getItem('user_email'),
        firstName: localStorage.getItem('user_firstname'),
        lastName: localStorage.getItem('user_lastname'),
        phone: localStorage.getItem('user_phone'),
        dateOfBirth: localStorage.getItem('user_dob'),
        gender: localStorage.getItem('user_gender'),
        city: localStorage.getItem('user_city'),
        state: localStorage.getItem('user_state'),
        zip: localStorage.getItem('user_zip'),
        country: localStorage.getItem('user_country'),
        externalId: localStorage.getItem('user_id')
      };
      
      // Only add non-null values
      Object.keys(stored).forEach(key => {
        if (stored[key] && !userData[key]) {
          userData[key] = stored[key];
        }
      });
    }

    // Try to extract from logged-in user meta tags
    if (typeof document !== 'undefined') {
      const emailMeta = document.querySelector('meta[name="user:email"]');
      const idMeta = document.querySelector('meta[name="user:id"]');
      
      if (emailMeta && !userData.email) userData.email = emailMeta.content;
      if (idMeta && !userData.externalId) userData.externalId = idMeta.content;
    }

    return userData;
  };

  /**
   * Build Advanced Matching parameters
   * Following Meta's latest requirements
   */
  const buildAdvancedMatching = async (userData) => {
    const advancedMatching = {};

    // Email (em) - Most important for matching
    if (userData.email) {
      const hashedEmail = await hashValue(userData.email);
      if (hashedEmail) advancedMatching.em = hashedEmail;
    }

    // Phone (ph) - Second most important
    if (userData.phone) {
      const normalizedPhone = normalizePhone(userData.phone);
      const hashedPhone = await hashValue(normalizedPhone);
      if (hashedPhone) advancedMatching.ph = hashedPhone;
    }

    // First Name (fn)
    if (userData.firstName) {
      const hashedFn = await hashValue(userData.firstName);
      if (hashedFn) advancedMatching.fn = hashedFn;
    }

    // Last Name (ln)
    if (userData.lastName) {
      const hashedLn = await hashValue(userData.lastName);
      if (hashedLn) advancedMatching.ln = hashedLn;
    }

    // Date of Birth (db) - Format: YYYYMMDD
    if (userData.dateOfBirth) {
      const dob = userData.dateOfBirth.replace(/\D/g, '');
      const hashedDb = await hashValue(dob);
      if (hashedDb) advancedMatching.db = hashedDb;
    }

    // Gender (ge) - m or f
    if (userData.gender) {
      const gender = userData.gender.toLowerCase().charAt(0);
      if (gender === 'm' || gender === 'f') {
        const hashedGe = await hashValue(gender);
        if (hashedGe) advancedMatching.ge = hashedGe;
      }
    }

    // City (ct)
    if (userData.city) {
      const hashedCt = await hashValue(userData.city);
      if (hashedCt) advancedMatching.ct = hashedCt;
    }

    // State (st)
    if (userData.state) {
      const hashedSt = await hashValue(userData.state.toLowerCase());
      if (hashedSt) advancedMatching.st = hashedSt;
    }

    // Zip Code (zp)
    if (userData.zip) {
      const hashedZp = await hashValue(userData.zip);
      if (hashedZp) advancedMatching.zp = hashedZp;
    }

    // Country (country) - 2-letter ISO code
    if (userData.country) {
      const country = userData.country.toLowerCase().substring(0, 2);
      const hashedCountry = await hashValue(country);
      if (hashedCountry) advancedMatching.country = hashedCountry;
    }

    // External ID (external_id) - Your internal user ID
    if (userData.externalId) {
      const hashedId = await hashValue(userData.externalId);
      if (hashedId) advancedMatching.external_id = hashedId;
    }

    return advancedMatching;
  };

  useEffect(() => {
    // Don't initialize if pixel ID is not configured
    if (!pixelId) return;

    // Initialize Advanced Matching when component mounts
    const initAdvancedMatching = async () => {
      if (typeof window !== 'undefined' && window.fbq) {
        const userData = getUserData();
        const advancedMatching = await buildAdvancedMatching(userData);
        
        // Re-initialize pixel with Advanced Matching
        window.fbq('init', pixelId, advancedMatching);
        
        // Track PageView with Advanced Matching active
        window.fbq('track', 'PageView');
      }
    };

    // Delay initialization to ensure user data is available
    setTimeout(initAdvancedMatching, 100);
  }, [pixelId, buildAdvancedMatching]);

  // Don't render if pixel ID is not configured
  if (!pixelId) return null;

  return (
    <>
      <Script
        id="fb-pixel-advanced"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          
          // Initial basic init (will be enhanced with Advanced Matching)
          fbq('init', '${pixelId}');
          
          // Enable Advanced Matching globally
          fbq('set', 'autoConfig', 'false', '${pixelId}');
          `,
        }}
      />
      
      {/* Load CryptoJS for hashing support */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
        strategy="afterInteractive"
      />
      
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      
      {/* Facebook domain verification */}
      <meta name="facebook-domain-verification" content="i9vf84c1q1m8d0i0oqf1w5d5t0yl5w" />
    </>
  );
};

export default FacebookPixelAdvanced;