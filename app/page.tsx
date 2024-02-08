import Image from "next/image";
import {FrameMetadata} from "@coinbase/onchainkit";

export default function Home() {
  return (
  <FrameMetadata
      buttons={[
        {
          label: 'How much did I paper hand?',
        },
      ]}
      image="https://degen-paper-hands.vercel.app/degen-paper-hands.png"
      input={{
        text: 'How much did I paper hand?',
      }}
      post_url="https://degen-paper-hands.vercel.app/api/frame"
  />
);
}
