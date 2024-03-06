import React, { useState } from 'react';
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import baseUrl from '@/utils/baseUrl'
import GoogleMap from './GoogleMap';

const alertContent = () => {
    MySwal.fire({
        title: 'Спасибо!',
        text: 'Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.',
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

    const [contact, setContact] = useState(INITIAL_STATE);
    const handleChange = e => {
        const { name, value } = e.target;
        setContact(prevState => ({ ...prevState, [name]: value }));
        // console.log(contact)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const { name, email, number, subject, text } = contact;
      
        if (!name || !email || !number || !subject || !text) {
          alert('Please fill all fields');
          return;
        }
      
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          alert('Please enter a valid email address');
          return;
        }
      
        const numberRegex = /^\+[0-9]+$/;
        if (!numberRegex.test(number)) {
          alert(`Please enter a valid number. Don't forget the + sign`);
          return;
        }
      
        try {
          const url = `${baseUrl}/api/contact`;
          const payload = { name, email, number, subject, text };
          const response = await axios.post(url, payload);
          console.log(response);
          setContact(INITIAL_STATE);
          alertContent();
        } catch (error) {
          console.log(error);
        }
      };

    return (
        <>
            <div className="contact-area ptb-100">
                <div className="container">
                    <div className="section-title">
                        <h2>Форма Обратной Связи</h2>
                        <p>Для связи с нами вы можете воспользоваться формой обратной связи. Наша команда свяжется с вами в кратчайшие сроки.</p>
                    </div>

                    <div className="contact-form">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="form-group">
                                        <input 
                                            type="text" 
                                            name="name" 
                                            placeholder="Полное имя" 
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
                                            placeholder="Email" 
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
                                            placeholder="Номер Телефона" 
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
                                            placeholder="Тема" 
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
                                            placeholder="Ваше сообщение..." 
                                            className="form-control" 
                                            value={contact.text}
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <button type="submit" className="default-btn">
                                        Отправить сообщение
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ContactForm;