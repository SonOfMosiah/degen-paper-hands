// Step 1. import getFrameMessage from @coinbase/onchainkit
import {FrameRequest, getFrameHtmlResponse, getFrameMessage} from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';

async function getResponse(req: NextRequest): Promise<NextResponse> {
    // Step 2. Read the body from the Next Request
    const body: FrameRequest = await req.json();
    // Step 3. Validate the message
    const { isValid, message } = await getFrameMessage(body , {
        neynarApiKey: process.env.NEYNAR_API_KEY,
    });

    const degenAddress = '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed'
    const nonfungiblePositionManager = '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1'

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

            const toTransfers = await toResponse.json();
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

            const fromTransfers = await fromResponse.json();
            // Handle your response data here
            console.log(fromTransfers);

            const fromTransfersExcludingNFT = fromTransfers.result.filter((transfer: any) => transfer.to !== nonfungiblePositionManager)

            if (!fromTransfersExcludingNFT) {
                // return image saying congratulations, you have not paper handed
                // current degen holdings: ${user}
            }

            // Assuming both toTransfersData and fromTransfersData have a result property that is an array of transfers
            let allTransfers = [...toTransfers.result, ...fromTransfers.result];

            // Exclude transfers to or from nonfungiblePositionManager
            allTransfers = allTransfers.filter((transfer: any) => transfer.to !== nonfungiblePositionManager && transfer.from !== nonfungiblePositionManager);

            // Sort by blockNum - assuming blockNum is a hex string, convert it to a number for comparison
            allTransfers.sort((a: any, b: any) => parseInt(a.blockNum, 16) - parseInt(b.blockNum, 16));

            // Handle the sorted and filtered transfers
            console.log(allTransfers);

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

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}
