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
      image="https://zizzamia.xyz/park-1.png"
      input={{
        text: 'How much did I paper hand?',
      }}
      post_url="https://degen-paper-hands.vercel.app/api/frame"
  />
);
}
