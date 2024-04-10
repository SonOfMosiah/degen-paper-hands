import type { FarcasterUser } from '../types'

export const getUserByFid = async (fid: number) => {
    const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}}&viewer_fid=3`
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            api_key: 'NEYNAR_FROG_FM',
        },
    }

    const farcasterUser = await fetch(url, options)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json()
        })
        .then((data) => {
            return data.users[0]
        })
        .catch((error) => {
            console.error('Fetch error:', error)
        })

    return {
        fid: farcasterUser.fid,
        username: farcasterUser.username,
        ethAddresses: farcasterUser.verified_addresses.eth_addresses,
        powerBadge: farcasterUser.power_badge,
    } as FarcasterUser
}
