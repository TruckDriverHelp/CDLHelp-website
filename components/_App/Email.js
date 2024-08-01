import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../../public/css/pages-and-components-css/Email.module.css';

const Email = ({ translation }) => {
  const router = useRouter();
  const [hideForm, setHideForm] = useState(false);
  const [email, setEmailAddress] = useState('');
  const [sending, setSending] = useState(false);

  const handleNewsletterChange = (e) => {
    setEmailAddress(e.target.value);
  };

  const handleSubscribeNewsletter = async () => {
    setSending(true);

    try {
      const response = await fetch('/api/newsletter', {
        body: JSON.stringify({ email: email, locale: router.locale, translation: translation }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (response.ok) {
        setHideForm(true);
        alert("Email sent for verification");
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Failed to send the request. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return !hideForm ? (
    <div>
      <p>Хотите быть в курсе новостей? Подпишитесь на email-рассылку</p>
      <div className={styles.inputContainer}>
        <input
          value={email}
          type='email'
          onChange={handleNewsletterChange}
          placeholder='Email'
          className={styles.inputField}
        />
        <button
          className={styles.emailButton}
          disabled={sending}
          onClick={handleSubscribeNewsletter}
        >
          Подписаться
        </button>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default Email;
