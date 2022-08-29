import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';

export async function middleware( req: NextRequest ) {
    console.log('entrano al middleware');
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!session) {
        console.log('no has session');
        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();        
        url.pathname = '/auth/login';
        url.search = `?p=${requestedPage}`;
        return NextResponse.rewrite(url);        
        // return new Response(JSON.stringify({ messase: 'Not authorized'}), {
        //     status: 401,
        //     headers: {
        //         'Content-Type':'application/json'
        //     }
        // });
    }
    
    if ( req.nextUrl.pathname.startsWith('/api/admin/')) {
        const validRoles = ['admin', 'super-user', 'SEO'];
        if (!validRoles.includes( session.user.role )) {
            const url = req.nextUrl.clone();
            url.pathname = '/';
            return NextResponse.rewrite(url);
            // return new Response(JSON.stringify({ messase: 'Not authorized'}), {
            //     status: 401,
            //     headers: {
            //         'Content-Type':'application/json'
            //     }
            // });
        }
    }
    
    return NextResponse.next();
}
export const config = {
    matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*'],
}
