/** @jsxImportSource frog/jsx */
import {Button, FrameContext, TextInput} from "frog";

export const connectHandler = async (c: FrameContext) => {
    return c.res({
        action: `/getValue`,
        image: <img src="https://degenpaperhands.xyz/sad-paper-hands.png" />,
        intents: [
            <TextInput key={0} placeholder={'Input address or ens (optional)'} />,
            <Button key={1} value={'connect'}>Connect</Button>
        ],
        imageOptions: { width: 1200, height: 1200 },
    })
}