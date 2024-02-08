import Image from "next/image";
import {FrameMetadata} from "@coinbase/onchainkit";

export default function Home() {
  return (
  <FrameMetadata
      buttons={[
        {
          label: 'Tell me the story',
        },
        {
          action: 'link',
          label: 'Link to Google',
          target: 'https://www.google.com'
        },
        {
          action: 'post_redirect',
          label: 'Redirect to cute pictures',
        },
      ]}
      image="https://zizzamia.xyz/park-1.png"
      input={{
        text: 'How much did I paper hand?',
      }}
      post_url="https://degenpaperhands.vercel.app/api/frame"
  />
);
}
