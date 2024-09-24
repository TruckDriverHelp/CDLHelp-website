import React, { useState } from 'react';
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import baseUrl from '@/utils/baseUrl'
import GoogleMap from './GoogleMap';
import { useTranslation } from 'next-i18next';

const alertContent = (t) => {
    MySwal.fire({
        title: t("sentTitle"),
        text: t("sentText"),
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
    })
}

// Form initial state
const INITIAL_STATE = {
    name: "",
    email: "",
    number: "",
    subject: "",
    text: ""
};

const ContactForm = () => {
    const {t} = useTranslation("contact");

    const [contact, setContact] = useState(INITIAL_STATE);
    const handleChange = e => {
        const { name, value } = e.target;
        setContact(prevState => ({ ...prevState, [name]: value }));
        // console.log(contact)
    }

    const handleSubmit = async e => {
        e.preventDefault();
      
        const { name, email, number, subject, text } = contact;
      
        if (!name || !email || !number || !subject || !text) {
          alert(t("error.allfields"));
          return;
        }
      
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          alert((t("error.validemail")));
          return;
        }
      
        const numberRegex = /^\+[0-9]+$/;
        if (!numberRegex.test(number)) {
          alert(t("error.validnumber"));
          return;
        }
      
        try {
          const url = `${baseUrl}/api/contact`;
          const payload = { name, email, number, subject, text };
          const response = await axios.post(url, payload);
          console.log(response);
          setContact(INITIAL_STATE);
          alertContent(t);
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            <div className="contact-area ptb-100">
                <div className="container">
                    <div className="section-title">
                        <h2>{t("title")}</h2>
                        <p>{t("heading")}</p>
                    </div>

                    <div className="contact-form">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <input 
                                            type="text" 
                                            name="name" 
                                            placeholder={t("placeholder.name")}
                                            className="form-control" 
                                            value={contact.name}
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <input 
                                            type="text" 
                                            name="email" 
                                            placeholder={t("placeholder.email")}
                                            className="form-control" 
                                            value={contact.email}
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group"> 
                                        <input 
                                            type="text" 
                                            name="number" 
                                            placeholder={t("placeholder.phonenumber")}
                                            className="form-control" 
                                            value={contact.number}
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <input 
                                            type="text" 
                                            name="subject" 
                                            placeholder={t("placeholder.emailsubject")}
                                            className="form-control" 
                                            value={contact.subject}
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <div className="form-group">
                                        <textarea 
                                            name="text" 
                                            cols="30" 
                                            rows="6" 
                                            placeholder={t("placeholder.text")}
                                            className="form-control" 
                                            value={contact.text}
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <button type="submit" className="default-btn">
                                        {t("send")}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Google Map */}
                <GoogleMap />
            </div>
        </>
    )
}

export default ContactForm;