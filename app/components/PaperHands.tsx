/** @jsxImportSource frog/jsx */
import { Box, Heading, VStack, Text } from './ui'

export const PaperHands = ({
    valueLost,
    account,
    numAddresses,
}: {
    valueLost: string
    account: string
    numAddresses?: number | undefined
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
                <Heading>Paper Hands 😭</Heading>
                <Text>Value Lost: ${valueLost}</Text>
                <Text color="text200" size="15">
                    {`Account: ${account}`}
                </Text>
                {numAddresses ? (
                    <Text color="text200" size="15">
                        {`# of addresses checked: ${numAddresses}`}
                    </Text>
                ) : null}
            </VStack>
        </Box>
    )
}
