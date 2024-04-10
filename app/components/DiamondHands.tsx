/** @jsxImportSource frog/jsx */
import { Box, Heading, VStack, Text } from './ui'

export const DiamondHands = ({
    currentPortfolioValue,
}: {
    currentPortfolioValue: string
}) => {
    return (
        <Box
            grow
            alignVertical="center"
            alignHorizontal="center"
            backgroundColor="background"
            height="100%"
            width="100%"
        >
            <VStack gap="4">
                <Heading>Diamond Hands 🚀💎</Heading>
                <Text>Current Value: ${currentPortfolioValue}</Text>
            </VStack>
        </Box>
    )
}
