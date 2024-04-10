/** @jsxImportSource frog/jsx */
import { Button, FrameContext, TextInput } from 'frog'
import { Box, Heading, VStack, Text } from '../components/ui'

export const connectHandler = async (c: FrameContext) => {
    return c.res({
        action: `/getValue`,
        image: (
            <Box
                grow
                alignHorizontal="center"
                backgroundColor="background"
                padding="32"
            >
                <VStack gap="4">
                    <Heading>FrogUI 🐸</Heading>
                    <Text color="text200" size="20">
                        Build consistent frame experiences
                    </Text>
                </VStack>
            </Box>
        ),
        // <img src="https://degenpaperhands.xyz/sad-paper-hands.png" />,
        intents: [
            <TextInput
                key={0}
                placeholder={'Input address or ens (optional)'}
            />,
            <Button key={1} value={'connect'}>
                Connect
            </Button>,
        ],
        imageOptions: { width: 1200, height: 1200 },
    })
}
