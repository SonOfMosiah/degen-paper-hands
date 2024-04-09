import {degenAddress} from "../../constants";
import type {Address} from "viem";
import type { TransferData} from "../types";

export const getDegenTransfersOut = async (user: Address): Promise<TransferData[]> => {
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

    return fromTransfers;
}