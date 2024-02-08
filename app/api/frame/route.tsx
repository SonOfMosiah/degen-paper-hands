// Step 1. import getFrameMessage from @coinbase/onchainkit
import {FrameRequest, getFrameHtmlResponse, getFrameMessage} from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';

type TransferData = {
    blockNum: string;
    uniqueId: string;
    hash: string;
    from: string;
    to: string;
    value: number;
    erc721TokenId: string | null;
    erc1155Metadata: any | null; // Use 'any' if the structure is unknown or dynamic; otherwise, replace 'any' with a more specific type
    tokenId: string | null;
    asset: string;
    category: "erc20" | string; // Use a union type if there are a limited number of categories; otherwise, use 'string'
    rawContract: {
        value: string;
        address: string;
        decimal: string;
    };
};

interface TokenPricesQueryPayload {
    query: string;
    variables?: Record<string, any>;
}


const degenAddress = '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed'
const nonfungiblePositionManager = '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1'
const swapRouter = '0x2626664c2603336E57B271c5C0b26F421741e481'
const baseChainId = 8453

// if from swapRouter -> buy. if to swapRouter -> sell (else transfer and 0 cost basis)

async function getResponse(req: NextRequest): Promise<NextResponse> {
    // Step 2. Read the body from the Next Request
    const body: FrameRequest = await req.json();
    // Step 3. Validate the message
    const { isValid, message } = await getFrameMessage(body , {
        neynarApiKey: process.env.NEYNAR_API_KEY,
    });

    // Step 4. Determine the experience based on the validity of the message
    if (isValid) {
        const { interactor: { verified_accounts } } = message

        // todo: loop through verified_accounts and check if the user has interacted with the contract

        const user = verified_accounts[0]

        try {
            const toResponse = await fetch(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "id": 1,
                    "jsonrpc": "2.0",
                    "method": "alchemy_getAssetTransfers",
                    "params": [
                        {
                            "fromBlock": "0x8832C6",
                            "toBlock": "latest",
                            "toAddress": `${user}`,
                            "withMetadata": false,
                            "excludeZeroValue": true,
                            "maxCount": "0x3e8",
                            "contractAddresses": [
                                `${degenAddress}`
                            ],
                            "category": [
                                "erc20"
                            ],
                            "order": "asc"
                        }
                    ]
                })
            });

            if (!toResponse.ok) {
                throw new Error(`HTTP error! status: ${toResponse.status}`);
            }

            const {result: {transfers: toTransfers}} = await toResponse.json();
            // Handle your response data here
            console.log(toTransfers);

            const fromResponse = await fetch(`https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "id": 1,
                    "jsonrpc": "2.0",
                    "method": "alchemy_getAssetTransfers",
                    "params": [
                        {
                            "fromBlock": "0x8832C6",
                            "toBlock": "latest",
                            "fromAddress": `${user}`,
                            "withMetadata": false,
                            "excludeZeroValue": true,
                            "maxCount": "0x3e8",
                            "contractAddresses": [
                                `${degenAddress}`
                            ],
                            "category": [
                                "erc20"
                            ],
                            "order": "asc"
                        }
                    ]
                })
            });

            if (!fromResponse.ok) {
                throw new Error(`HTTP error! status: ${fromResponse.status}`);
            }

            const {result: {transfers: fromTransfers}} = await fromResponse.json();

            // Handle your response data here
            console.log(fromTransfers);

            const fromTransfersExcludingNFT = fromTransfers.filter((transfer: TransferData) => transfer.to !== nonfungiblePositionManager)

            if (!fromTransfersExcludingNFT) {
                // return image saying congratulations, you have not paper handed
                // current degen holdings: ${user}
            }

            // Assuming both toTransfersData and fromTransfersData have a result property that is an array of transfers
            let allTransfers: TransferData[] = [...toTransfers, ...fromTransfers];

            // Exclude transfers to or from nonfungiblePositionManager
            allTransfers = allTransfers.filter((transfer) => transfer.to !== nonfungiblePositionManager && transfer.from !== nonfungiblePositionManager);

            // Sort by blockNum - assuming blockNum is a hex string, convert it to a number for comparison
            allTransfers.sort((a, b) => parseInt(a.blockNum, 16) - parseInt(b.blockNum, 16));

            // Handle the sorted and filtered transfers
            console.log(allTransfers);

            const timestamps = allTransfers.map(transfer => parseInt(transfer.blockNum, 16)); // Convert blockNum to timestamp if needed

            // Fetch token prices
            const pricesResponse = await fetchTokenPrices(timestamps);

            // Handle the pricesResponse, e.g., log or process further
            console.log(pricesResponse);

        } catch (error) {
            console.error("Request failed", error);
            // Respond with error message or code
            return NextResponse.json('Internal Server Error', {status: 500})
        }
    } else {
        // sorry, the message is not valid and it will be undefined
        return NextResponse.json('Internal Server Error', {status: 500})
    }

    return new NextResponse(
        // Step 3. Use getFrameHtmlResponse to create a Frame response
        getFrameHtmlResponse({
            buttons: [
                {
                    label: `How much did I paper hand?`,
                },
            ],
            image:'https://build-onchain-apps.vercel.app/release/v-0-17.png',
            post_url: 'https://build-onchain-apps.vercel.app/api/frame',
        }),
    );
}

type GetTokenPriceInput = {
    address: string;
    networkId: number;
    timestamp?: number;
};

// Function to construct the GraphQL query for token prices
function constructTokenPricesQuery(timestamps: number[]): TokenPricesQueryPayload {
    // Construct the inputs array part of the query dynamically based on timestamps
    const inputs: GetTokenPriceInput[] = timestamps.map((timestamp) => ({
        address: degenAddress,
        networkId: baseChainId,
        timestamp: timestamp,
    }));

    inputs.push({
        address: degenAddress,
        networkId: baseChainId,
    })

    return {
        query: `
          query GetTokenPrices($inputs: [TokenPriceInput!]!) {
            getTokenPrices(inputs: $inputs) {
              priceUsd
            }
          }
        `,
        variables: {
            inputs,
        },
    };
}

// Function to fetch token prices
async function fetchTokenPrices(timestamps: number[]): Promise<any> {
    const payload = constructTokenPricesQuery(timestamps);

    try {
        const response = await fetch('https://graph.defined.fi/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": process.env.DEFINED_API_KEY!
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fetching token prices failed", error);
        throw error; // Rethrow or handle as needed
    }
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}
