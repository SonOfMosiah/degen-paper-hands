import { baseChainId, degenAddress } from '../../constants'

type GetTokenPriceInput = {
    address: string
    networkId: number
    timestamp?: number
}

// Function to construct the GraphQL query for token prices
export function constructTokenPricesQuery(
    timestamps: number[],
): GetTokenPriceInput[] {
    // Construct the inputs array part of the query dynamically based on timestamps
    const inputs: GetTokenPriceInput[] = timestamps.map((timestamp) => ({
        address: degenAddress,
        networkId: baseChainId,
        timestamp: timestamp,
    }))

    inputs.push({
        address: degenAddress,
        networkId: baseChainId,
    })

    return inputs
}

export async function fetchLatestPrice(): Promise<number> {
    const response = await fetch('https://graph.defined.fi/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.DEFINED_API_KEY!,
        },
        body: JSON.stringify({
            query: `
                    {
                    getTokenPrices(
                        inputs: [
                            { address: "${degenAddress}", networkId: ${baseChainId} }
                        ]
                    ) {
                        priceUsd
                    }
                    }
                `,
        }),
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const {
        data: { getTokenPrices },
    } = await response.json()
    return getTokenPrices[0].priceUsd
}

// Function to fetch token prices
export async function fetchTokenPrices(timestamps: number[]): Promise<any> {
    const inputs = constructTokenPricesQuery(timestamps)

    try {
        const response = await fetch('https://graph.defined.fi/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: process.env.DEFINED_API_KEY!,
            },
            body: JSON.stringify({
                query: `
                    query GetTokenPrices($inputs: [GetPriceInput!]!) {
                        getTokenPrices(inputs: $inputs) {
                            priceUsd
                        }
                    }
                `,
                variables: {
                    inputs: inputs,
                },
            }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const res = await response.json()
        console.log('res:', res)

        return res
    } catch (error) {
        console.error('Fetching token prices failed', error)
        throw error // Rethrow or handle as needed
    }
}

export async function fetchBlockTimestamp(blockNum: string): Promise<number> {
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: 1,
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: [blockNum, false],
        }),
    }

    try {
        const response = await fetch(
            `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            options,
        )
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        const timestampHex = data.result.timestamp
        return parseInt(timestampHex, 16) // Convert hex timestamp to number
    } catch (err) {
        console.error(err)
        throw new Error('Failed to fetch block timestamp')
    }
}
