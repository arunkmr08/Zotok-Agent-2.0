"use client";

import dynamic from "next/dynamic";

const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((m) => m.DotLottieReact),
  { ssr: false }
);

export function DeployedLottie() {
  return (
    <DotLottieReact
      src="/assets/lotties/e0c7b61a-075c-11ef-b167-f3415fe92e20.lottie"
      autoplay
      loop={false}
      speed={1}
      style={{ width: 200, height: 200 }}
    />
  );
}
