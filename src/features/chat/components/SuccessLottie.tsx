"use client";

import dynamic from "next/dynamic";

const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((m) => m.DotLottieReact),
  { ssr: false }
);

export function SuccessLottie() {
  return (
    <DotLottieReact
      src="/assets/success-feedback-animation.lottie"
      autoplay
      loop={false}
      speed={1}
      style={{ width: 36, height: 36 }}
    />
  );
}
