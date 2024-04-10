import { ImageResponse } from '@vercel/og'

export async function GET() {
    // Define the options for the ImageResponse to set a custom aspect ratio
    const options = {
        width: 1910, // Width of the image
        height: 1000, // Height of the image to maintain a 1.91:1 aspect ratio
        // Adjust fontSize, padding, etc., as needed
    }

    // Return an ImageResponse with the desired content and style
    return new ImageResponse(
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column', // Use column layout to stack text
                alignItems: 'center',
                justifyContent: 'center',
                background: 'lavender',
                color: 'black', // Adjust text color as needed
                fontSize: '48px', // Adjust font size as needed
                padding: '20px', // Add some padding if needed
            }}
        >
            <h1 style={{ margin: '0 0 20px 0' }}>
                Looks like you are not a degen
            </h1>
        </div>,
        options,
    )
}
