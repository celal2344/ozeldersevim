"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function useSearchFilterNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locationPending, setLocationPending] = useState(false);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams);
    params.delete("page");

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/ogretmen-bul?${params.toString()}`);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return;

    setLocationPending(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const params = new URLSearchParams(searchParams);
        params.set("lat", position.coords.latitude.toFixed(6));
        params.set("lng", position.coords.longitude.toFixed(6));
        params.set("sort", "nearest");
        params.delete("page");
        router.push(`/ogretmen-bul?${params.toString()}`);
        setLocationPending(false);
      },
      () => setLocationPending(false),
      { enableHighAccuracy: false, timeout: 7000 }
    );
  }

  return {
    locationPending,
    searchParams,
    updateParam,
    useCurrentLocation,
  };
}
