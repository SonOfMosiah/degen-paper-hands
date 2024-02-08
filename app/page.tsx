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
      image="https://degenpaperhands.xyz/sad-paper-hands.png"
      input={{
        text: 'Input your address here (optional)',
      }}
      post_url="https://degenpaperhands.xyz/api/frame"
  />
);
}
