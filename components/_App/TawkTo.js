import { useEffect } from 'react';

const TawkTo = () => {
    useEffect(() => {
        // Only load Tawk.to when the user interacts with the page
        const loadTawkTo = () => {
            if (window.Tawk_API) return;

            const s1 = document.createElement("script");
            const s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/670840f72480f5b4f58b9589/1i9s3rhun';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
        };

        // Load Tawk.to after user interaction
        const events = ['mousemove', 'click', 'scroll', 'keypress'];
        const loadOnInteraction = () => {
            loadTawkTo();
            events.forEach(event => {
                document.removeEventListener(event, loadOnInteraction);
            });
        };

        events.forEach(event => {
            document.addEventListener(event, loadOnInteraction, { once: true });
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, loadOnInteraction);
            });
        };
    }, []);

    return null;
};

export default TawkTo; 