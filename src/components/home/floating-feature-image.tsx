"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

type FloatingFeatureImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function FloatingFeatureImage({
  src,
  alt,
  className,
}: FloatingFeatureImageProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.to(".float-media", {
        y: -14,
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(".float-glow", {
        opacity: 0.55,
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={cn("relative mx-auto w-full max-w-md", className)}>
      <div
        className="float-glow pointer-events-none absolute -inset-6 rounded-[2rem] bg-gold-500/25 blur-3xl"
        aria-hidden
      />
      <div className="float-media relative overflow-hidden rounded-[1.75rem] border border-gold-500/25 shadow-[var(--shadow-md)]">
        <Image
          src={src}
          alt={alt}
          width={900}
          height={900}
          className="h-auto w-full object-cover"
          sizes="(max-width: 1024px) 90vw, 420px"
          priority={false}
        />
      </div>
    </div>
  );
}
