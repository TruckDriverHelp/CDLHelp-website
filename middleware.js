import { NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req) {
    const url = req.nextUrl.clone();
    const { pathname, locale } = req.nextUrl;
    
    // Skip middleware for Next.js internals and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('/api/') ||
        PUBLIC_FILE.test(pathname)
    ) {
        return
    }

    // Handle legacy Russian URL redirects
    const legacyRedirects = {
        '/dalnoboishik': '/ru/kak-stat-dalnoboishikom',
        '/permit': '/ru/kak-poluchit-cdl-permit',
        '/kak-ispolzovat-cdl-help': '/ru/kak-ispolzovat-cdlhelp',
        '/faq': '/ru/chasto-zadavaemye-voprosy',
        '/cdl-shkola': '/ru/o-cdl-shkolakh',
        '/o-shkolax': '/ru/o-cdl-shkolakh',
        '/kak-poluchit-cdl': '/ru/kak-poluchit-cdl'
    };

    // Check if current path matches a legacy URL
    if (legacyRedirects[pathname]) {
        url.pathname = legacyRedirects[pathname];
        return NextResponse.redirect(url, 301);
    }

    // Remove trailing slashes (except for homepage)
    if (pathname !== '/' && pathname.endsWith('/')) {
        url.pathname = pathname.slice(0, -1);
        return NextResponse.redirect(url, 301);
    }

    // Prevent double locale in path (e.g., /ru/ru/...)
    const locales = ['ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
    const pathSegments = pathname.split('/').filter(Boolean);
    
    if (pathSegments.length >= 2 && 
        locales.includes(pathSegments[0]) && 
        pathSegments[0] === pathSegments[1]) {
        // Remove the duplicate locale
        url.pathname = '/' + pathSegments[0] + '/' + pathSegments.slice(2).join('/');
        return NextResponse.redirect(url, 301);
    }

    // Handle default locale redirect
    if (locale === 'default') {
        const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value || 'en'
        return NextResponse.redirect(
            new URL(`/${cookieLocale === 'en' ? '' : cookieLocale}${pathname}${req.nextUrl.search}`, req.url),
            301
        )
    }
}

export const config = {
    matcher: [
        // Match all pathnames except for
        // - api routes
        // - _next (Next.js internals)
        // - static files (e.g. *.ico, *.svg)
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ]
}