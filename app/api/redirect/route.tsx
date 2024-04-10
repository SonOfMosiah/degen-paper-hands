import { NextRequest, NextResponse } from 'next/server'
async function getResponse(): Promise<NextResponse> {
    return NextResponse.redirect(
        `https://degenpaperhands.xyz/api/redirect/uniswap`,
        {
            status: 302,
        },
    )
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse()
}

export const dynamic = 'force-dynamic'
