import { NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req) {
    const url = req.nextUrl.clone();
    
    // Skip middleware for Next.js internals and API routes
    if (
        req.nextUrl.pathname.startsWith('/_next') ||
        req.nextUrl.pathname.includes('/api/') ||
        PUBLIC_FILE.test(req.nextUrl.pathname)
    ) {
        return
    }

    // Remove trailing slashes (except for homepage)
    if (url.pathname !== '/' && url.pathname.endsWith('/')) {
        url.pathname = url.pathname.slice(0, -1);
        return NextResponse.redirect(url, 301);
    }

    // Handle default locale redirect
    if (req.nextUrl.locale === 'default') {
        const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en'
        return NextResponse.redirect(
            new URL(`/${locale === 'en' ? '' : locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url),
            301
        )
    }
}