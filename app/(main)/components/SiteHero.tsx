import React from "react";

type SiteHeroProps = {
  children: React.ReactNode;
  layout?: "contained" | "raw";
  className?: string;
  useDefaultBackground?: boolean;
};

export default function SiteHero({
  children,
  layout = "contained",
  className = "",
  useDefaultBackground = true,
}: SiteHeroProps) {
  return (
    <section
      className={`relative w-full overflow-visible bg-white bg-cover bg-no-repeat bg-top
      flex items-center justify-center
      min-h-[600px] md:min-h-[700px] lg:min-h-[800px] ${className}`}
      style={{
        ...(useDefaultBackground
          ? {
              backgroundImage: "url(/images/Bg.png)",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }
          : undefined),
      }}
    >
      {/* Mobile background */}
      {useDefaultBackground && (
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-top md:hidden"
          style={{
            backgroundImage: "url(/images/MBG.png)",
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        />
      )}

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[240px] bg-gradient-to-b from-white/0 to-white z-[5]" />

      {layout === "raw" ? (
        <div className="relative z-10 w-full">{children}</div>
      ) : (
        <div className="relative z-10 w-full section-padding">
          <div className="w-full mx-auto">
            <div className="w-full mx-auto flex flex-col items-center text-center">
              {children}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
