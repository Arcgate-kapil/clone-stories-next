"use client";
 
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
 
const GA_TRACKING_ID = "G-G4L18N2N9M";
 
export const pageview = (url) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};
 
export const Analytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
 
  useEffect(() => {
    if (window.location.hostname === "localhost") return;
    const url = pathname + searchParams.toString();
    pageview(url);
  }, [pathname, searchParams]);
 
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
};