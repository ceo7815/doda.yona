"use client";

import { useEffect } from "react";
import { useCart } from "@/stores/cart";

export function ClearCartOnSuccess() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return null;
}
