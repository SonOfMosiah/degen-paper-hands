import type { FarcasterUser } from '../types'

export const getUserByUsername = async (username: string) => {
    const url = `https://api.neynar.com/v1/farcaster/user-by-username?username=${username}&viewerFid=3`
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            api_key: process.env.NEYNAR_API_KEY ?? 'NEYNAR_FROG_FM',
        },
    }

    const farcasterUser = await fetch(url, options)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json() // Parsing the JSON body of the response
        })
        .then((data) => {
            console.log(data) // Handling the data from the request
            return data.result.user
        })
        .catch((error) => {
            console.error('Fetch error:', error) // Handling any errors that occur during the fetch
        })

    return {
        fid: farcasterUser.fid,
        username: farcasterUser.username,
        ethAddresses: farcasterUser.verifiedAddresses.eth_addresses,
        powerBadge: farcasterUser.powerBadge,
    } as FarcasterUser
}
