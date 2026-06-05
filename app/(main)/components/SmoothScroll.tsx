"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<any>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (lenisRef.current?.lenis) {
            lenisRef.current.lenis.scrollTo(0, { immediate: true });
        }
    }, [pathname]);

    return (
        <ReactLenis ref={lenisRef} root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
            {children}
        </ReactLenis>
    );
}
