/** @jsxImportSource frog/jsx */

import { Button, TextInput } from 'frog'
import { type Address, createClient, http, isAddress } from 'viem'
import { db } from '../../drizzle'
import { users } from '../../drizzle/schema'

import {
    nonfungiblePositionManagerAddress,
    swapRouterAddress,
} from '../../constants'
import type { FrameContext } from 'frog'
import { getDegenTransfersIn } from '../helpers/getDegenTransfersIn'
import { getDegenTransfersOut } from '../helpers/getDegenTransfersOut'
import { getEnsAddress } from 'viem/actions'
import { normalize } from 'viem/ens'
import { mainnet } from 'viem/chains'
import { NoDegen } from '../components/NoDegen'
import { TransferData } from '../types'
import {
    fetchBlockTimestamp,
    fetchLatestPrice,
    fetchTokenPrices,
} from '../helpers'
import { NextResponse } from 'next/server'
import { DiamondHands } from '../components/DiamondHands'
import { PaperHands } from '../components/PaperHands'
import { getUserByUsername } from '../helpers/getUserByUsername'
import { getUserByFid } from '../helpers/getUserByFid'

const textInput = (
    <TextInput key={0} placeholder={'Search address, username or fid'} />
)
const statsButton = (
    <Button key={1} value={'stats'}>
        My Stats
    </Button>
)
// todo: change dexscreener button to a leaderboard page
const dexscreenerButton = (
    <Button.Link
        key={2}
        href={
            'https://dexscreener.com/base/0xc9034c3e7f58003e6ae0c8438e7c8f4598d5acaa'
        }
    >
        Degen Chart
    </Button.Link>
)
// todo: embed the user's address in the share link
const shareButton = (
    <Button.Link
        key={3}
        href={
            'https://warpcast.com/~/compose?text=Paper handed $degen? Check below!&embeds[]=https://degenpaperhands.xyz'
        }
    >
        Share
    </Button.Link>
)
const lookupButton = (
    <Button key={4} value={'lookup'}>
        🔎
    </Button>
)

const intents = [
    textInput,
    statsButton,
    dexscreenerButton,
    shareButton,
    lookupButton,
]

// todo: get stats for amount airdropped, sold, bought
export const getValueHandler = async (c: FrameContext) => {
    const { inputText, buttonValue } = c

    let user: Address | undefined
    let userAddresses: Address[] = []
    let fid: number | undefined
    let account: string | undefined
    let numAddresses: number | undefined

    // 4 user paths:
    // 1. user address
    // 2. ens name
    // 3. farcaster fname
    // 4. farcaster fid
    if (buttonValue === 'lookup') {
        if (!inputText) {
            return NextResponse.json(
                {
                    message: 'Invalid input text',
                },
                {
                    status: 400,
                },
            )
        }
        if (isAddress(inputText)) {
            // user address path
            user = inputText
            userAddresses.push(user)
            account = inputText
            numAddresses = 1
        } else if (inputText.endsWith('.eth')) {
            // todo: need to first check if the ens name is used as a farcaster name

            account = inputText
            // ens name path
            const client = createClient({
                chain: mainnet,
                transport: http(),
            })
            const ensAddress = await getEnsAddress(client, {
                name: normalize(inputText),
            })
            user = ensAddress as Address
            userAddresses.push(user)
            numAddresses = 1
        } else if (!isNaN(Number(inputText))) {
            // this is the fid path
            const farcasterUser = await getUserByFid(Number(inputText))
            const { ethAddresses } = farcasterUser
            account = `@${farcasterUser.username}`
            user = ethAddresses[0]
            userAddresses = userAddresses.concat(ethAddresses)
            numAddresses = ethAddresses.length
        } else {
            // this is the farcaster name path
            account = `@${inputText}`
            const farcasterUser = await getUserByUsername(inputText)
            const { ethAddresses } = farcasterUser
            user = ethAddresses[0]
            userAddresses = userAddresses.concat(ethAddresses)
            numAddresses = ethAddresses.length
        }
    } else {
        const {
            verifiedAddresses,
            fid: fid_,
            username,
        } = c.var.interactor as {
            verifiedAddresses: {
                ethAddresses: Address[]
                solAddresses: string[]
            }
            fid: number
            username: string
        }

        const { ethAddresses } = verifiedAddresses
        user = ethAddresses[0]
        userAddresses.concat(ethAddresses)
        fid = fid_
        account = `@${username}`
        numAddresses = ethAddresses.length
    }

    if (!user) throw new Error('User not found')

    const [toTransfers, fromTransfers, latestPrice] = await Promise.all([
        getDegenTransfersIn(userAddresses),
        getDegenTransfersOut(userAddresses),
        fetchLatestPrice(),
    ])

    if (!fromTransfers?.length && !toTransfers?.length) {
        return c.res({
            image: NoDegen({
                account,
            }),
            intents,
        })
    }

    const airdropAddresses = ['0xc4794f15f05d903bcd4ffebe1baeeefbc5f801cc']

    const airdrops = toTransfers.filter((transfer) =>
        airdropAddresses.includes(transfer.from.toLowerCase()),
    )

    const fromTransfersExcludingNFT = fromTransfers.filter(
        (transfer) =>
            transfer.to.toLowerCase() !==
            nonfungiblePositionManagerAddress.toLowerCase(),
    )

    // Account has only received DEGEN (not a paper hand)
    if (!fromTransfersExcludingNFT) {
        const totalTokensReceived = toTransfers.reduce(
            (acc: number, transfer: TransferData) => acc + transfer.value,
            0,
        )
        const currentPortfolioValue = (
            totalTokensReceived * latestPrice
        ).toFixed(2)

        if (buttonValue === 'stats') {
            await db
                .insert(users)
                .values({
                    id: Number(fid),
                    valueLost: '0.00',
                    currentPortfolioValue: String(currentPortfolioValue),
                    potentialPortfolioValue: String(currentPortfolioValue),
                    degenAmount: String(totalTokensReceived),
                })
                .onConflictDoUpdate({
                    target: users.id,
                    set: {
                        valueLost: '0.00',
                        currentPortfolioValue: String(currentPortfolioValue),
                        potentialPortfolioValue: String(currentPortfolioValue),
                        degenAmount: String(totalTokensReceived),
                    },
                })
        }

        return c.res({
            image: DiamondHands({
                currentPortfolioValue,
            }),
            intents,
        })
    }

    // Assuming both toTransfersData and fromTransfersData have a result property that is an array of transfers
    let allTransfers: TransferData[] = [...toTransfers, ...fromTransfers]

    // Exclude transfers to or from nonfungiblePositionManager
    allTransfers = allTransfers.filter(
        (transfer) =>
            transfer.to.toLowerCase() !==
                nonfungiblePositionManagerAddress.toLowerCase() &&
            transfer.from.toLowerCase() !==
                nonfungiblePositionManagerAddress.toLowerCase(),
    )

    // Sort by blockNum - assuming blockNum is a hex string, convert it to a number for comparison
    allTransfers.sort(
        (a, b) => parseInt(a.blockNum, 16) - parseInt(b.blockNum, 16),
    )

    const timestamps = await Promise.all(
        allTransfers.map(
            async (transfer) => await fetchBlockTimestamp(transfer.blockNum),
        ),
    )

    // Fetch token prices
    const pricesResponse = await fetchTokenPrices(timestamps)

    const pricesArray = pricesResponse.data.getTokenPrices.map(
        (price: any) => price.priceUsd,
    )

    const totalTokensReceived = toTransfers.reduce(
        (acc: number, transfer: TransferData) => acc + transfer.value,
        0,
    )
    const totalTokensSent = fromTransfers.reduce(
        (acc: number, transfer: TransferData) => acc + transfer.value,
        0,
    )

    const potentialPortfolioValue = totalTokensReceived * latestPrice
    const currentPortfolioValue =
        (totalTokensReceived - totalTokensSent) * latestPrice

    // Step 1: Filter transfers to the swap router, but keep track of the original indices
    const allSaleTransfers = allTransfers
        .map((transfer, index) => ({ ...transfer, index })) // Append the original index to each transfer
        .filter(
            (transfer) =>
                transfer.to.toLowerCase() === swapRouterAddress.toLowerCase(),
        )

    // Step 2: Map over this filtered list to multiply values by the correct prices
    const allSales = allSaleTransfers.map((transfer) => {
        const priceMultiplier = pricesArray[transfer.index] // Access the correct price using the original index
        return transfer.value * priceMultiplier
    })

    // Step 3: Sum the multiplied values
    const totalSaleValue = allSales.reduce(
        (acc, currentValue) => acc + currentValue,
        0,
    )

    // Step 1: Filter transfers to the swap router, but keep track of the original indices
    const allBuyTransfers = allTransfers
        .map((transfer, index) => ({ ...transfer, index })) // Append the original index to each transfer
        .filter(
            (transfer) =>
                transfer.from.toLowerCase() === swapRouterAddress.toLowerCase(),
        )

    // Step 2: Map over this filtered list to multiply values by the correct prices
    const allBuys = allBuyTransfers.map((transfer) => {
        const priceMultiplier = pricesArray[transfer.index] // Access the correct price using the original index
        return transfer.value * priceMultiplier
    })

    // Step 3: Sum the multiplied values
    const totalBuyValue = allBuys.reduce(
        (acc, currentValue) => acc + currentValue,
        0,
    )

    // todo: should include the cost basis of the tokens on buy and sell.
    const lostValue = (
        potentialPortfolioValue -
        currentPortfolioValue -
        totalSaleValue +
        totalBuyValue
    ).toFixed(2)

    if (buttonValue === 'stats') {
        await db
            .insert(users)
            .values({
                id: Number(fid),
                valueLost: lostValue,
                currentPortfolioValue: String(currentPortfolioValue),
                potentialPortfolioValue: String(potentialPortfolioValue),
                degenAmount: String(totalTokensReceived - totalTokensSent),
            })
            .onConflictDoUpdate({
                target: users.id,
                set: {
                    valueLost: lostValue,
                    currentPortfolioValue: String(currentPortfolioValue),
                    potentialPortfolioValue: String(potentialPortfolioValue),
                    degenAmount: String(totalTokensReceived - totalTokensSent),
                },
            })
    }

    // todo: create new state if lostValue is less than 0
    const image = () => {
        if (+lostValue < 0) {
            return PaperHands({ valueLost: lostValue, account, numAddresses })
        }
        if (+lostValue === 0) {
            return DiamondHands({
                currentPortfolioValue: String(currentPortfolioValue),
            })
        }
        return PaperHands({ valueLost: lostValue, account, numAddresses })
    }

    return c.res({
        image: image(),
        intents,
    })
}
