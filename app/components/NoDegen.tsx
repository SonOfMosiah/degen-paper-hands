/** @jsxImportSource frog/jsx */
import {Box, Heading, VStack, Text} from "./ui";

export const NoDegen = () => {
    return (
        <Box
            grow
            alignVertical="center"
            backgroundColor="background"
            padding="32"
        >
            <VStack gap="4">
                <Heading size="40">{"Looks like you're not a degen"}</Heading>
                <Text color="text200" size="20">
                    {"Looks like you're not a degen"}
                </Text>
        </VStack>
      </Box>
    )
}