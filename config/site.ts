type SiteConfig = {
    name: string
    description: string
    url: string
    ogImage: string
    links?: {
        twitter: string
        github: string
    }
}

export const siteConfig: SiteConfig = {
    name: 'Degen Paper Hands',
    description: 'Check your paper hands score!',
    url: 'https://degenpaperhands.xyz',
    ogImage: 'https://degenpaperhands.xyz/sad-paper-hands.png',
}
