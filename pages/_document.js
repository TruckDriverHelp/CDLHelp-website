import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script'

class MyDocument extends Document {
    render() {
        return (
            <Html lang="zxx">
                <Head>
                <Script id="google-tag-manager" strategy="afterInteractive">
                {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-KQW58WK');`}
                </Script>
                    <link rel="icon" href="/images/favicon.ico"></link>
										<meta
											name="description"
											content="CDL Help это уникальное приложение с переводом CDL на русский в режиме реального времени. Лучший способ подготовки к сдачи тестов и обучению языка."
											key="desc"
										/>

                <Script strategy="afterInteractive">
                    {`
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '766792617985084');
                    fbq('track', 'PageView');
                    `}
                </Script>
                <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KQW58WK"
                height="0" width="0" style={{display:"none", visibility:"hidden"}}></iframe></noscript>
                <noscript><img height="1" width="1" style={{display : "none"}}
                src="https://www.facebook.com/tr?id=766792617985084&ev=PageView&noscript=1"
                /></noscript>
                <meta name="facebook-domain-verification" content="ylykgg2h1ne4yq50pt6x0miqebkq1k" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument;