import type { Address } from 'viem'

export type TransferData = {
    blockNum: string
    uniqueId: string
    hash: string
    from: string
    to: string
    value: number
    erc721TokenId: string | null
    erc1155Metadata: any | null // Use 'any' if the structure is unknown or dynamic; otherwise, replace 'any' with a more specific type
    tokenId: string | null
    asset: string
    category: 'erc20' | string // Use a union type if there are a limited number of categories; otherwise, use 'string'
    rawContract: {
        value: string
        address: string
        decimal: string
    }
}

export type FarcasterUser = {
    fid: number
    username: string
    ethAddresses: Address[]
    powerBadge: boolean
}
