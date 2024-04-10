import { NextRequest, NextResponse } from 'next/server'
async function getResponse(): Promise<NextResponse> {
    return NextResponse.redirect(
        `https://info.uniswap.org/#/base/tokens/0x4ed4e862860bed51a9570b96d89af5e1b0efefed`,
        {
            status: 302,
        },
    )
}

export async function GET(req: NextRequest): Promise<Response> {
    return getResponse()
}

export const dynamic = 'force-dynamic'
