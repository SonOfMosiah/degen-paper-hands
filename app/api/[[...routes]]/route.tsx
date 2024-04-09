/** @jsxImportSource frog/jsx */

import { Button, FrameContext, Frog, TextInput } from 'frog'
import { neynar, pinata } from 'frog/hubs'
import { handle } from 'frog/next'
import { neynar as neynarMiddleware } from 'frog/middlewares'

import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
import {getValueHandler} from "../../handlers/getValue";
import {connectHandler} from "../../handlers/connect";

// export const runtime = 'edge'

type State = {
    automationId: number
}

const app = new Frog<{ State: State }>({
    basePath: '/api',
    imageAspectRatio: '1:1',
    // Supply a Hub to enable frame verification.
    verify: 'silent',
    hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
})

app.use(neynarMiddleware({ apiKey: 'NEYNAR_FROG_FM', features: ['interactor', 'cast'] }))

app.frame(`/`, connectHandler)
app.frame('/getValue', getValueHandler)


devtools(app, {
    serveStatic,
})

export const GET = handle(app)
export const POST = handle(app)
