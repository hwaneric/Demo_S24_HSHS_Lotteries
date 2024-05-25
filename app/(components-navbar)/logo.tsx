"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import light_logo from "/images/header.png";
import dark_logo from "/images/headerHSHSdarkmode.png";

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const src = resolvedTheme == "dark" ? dark_logo : light_logo;

  return <Image src={src} width={200} height={200} style={{ objectFit: "contain" }} alt="HSHS Logo" />;
}
