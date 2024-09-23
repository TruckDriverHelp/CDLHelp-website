import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '@/components/_App/Navbar';
import Footer from '@/components/_App/Footer';

const Confirm = ({ translations }) => {
    const router = useRouter();
    const { code, locale } = router.query;
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const verifyCode = async () => {
            if (code) {
                try {
                    const response = await fetch(`/api/confirm?code=${code}&locale=${locale}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (response.ok) {
                        setStatus('success');
                    } else {
                        setStatus('error');
                    }
                } catch (error) {
                    setStatus('error');
                    console.error('Network error:', error);
                }
            }
        };

        verifyCode();
    }, [code]);
    return (
        <>
            <Navbar />
            <div style={{height: "auto"}}>
                {status === 'loading' && <p>Проверка</p>}
                {status === 'success' &&
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: "40vh"
                    }}>
                        <h1>Почта подтверждена</h1>
                    </div>}

                {status === 'error' &&
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: "40vh"
                    }}>
                        <h1>Недействительная ссылка</h1>
                    </div>}
            </div>
            <div style={{position: "absolute", width: "100%", bottom: 0}}>
            <Footer />
            </div>
        </>
    )
};


export default Confirm;
