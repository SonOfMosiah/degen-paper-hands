import {type Address} from "viem";
import {degenAddress} from "../../constants";
import type {TransferData} from "../types";

export const getDegenTransfersIn = async (user: Address): Promise<TransferData[]> => {
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

    return toTransfers;
}