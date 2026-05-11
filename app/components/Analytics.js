// "use client";

// import Script from "next/script";
// import { usePathname, useSearchParams } from "next/navigation";
// import { useEffect } from "react";

// const GA_TRACKING_ID = "G-G4L18N2N9M";

// export const pageview = (url) => {
//   if (typeof window.gtag !== "undefined") {
//     window.gtag("config", GA_TRACKING_ID, {
//       page_path: url,
//     });
//   }
// };

// export const Analytics = () => {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     if (window.location.hostname === "localhost") return;
//     const url = pathname + searchParams.toString();
//     pageview(url);
//   }, [pathname, searchParams]);

//   return (
//     <>
//       <Script
//         strategy="lazyOnload"
//         src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
//       />
//       <Script id="google-analytics" strategy="lazyOnload">
//         {`
//           window.dataLayer = window.dataLayer || [];
//           function gtag(){dataLayer.push(arguments);}
//           gtag('js', new Date());
//           gtag('config', '${GA_TRACKING_ID}', {
//             page_path: window.location.pathname,
//           });
//         `}
//       </Script>
//     </>
//   );
// };

"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const GA_TRACKING_ID = "G-G4L18N2N9M";
const ANALYTICS_DELAY = 3500;

export const pageview = (url) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const Analytics = () => {
  const pathname = usePathname();
  const [canLoadAnalytics, setCanLoadAnalytics] = useState(false);

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      return undefined;
    }

    const loadAnalytics = () => setCanLoadAnalytics(true);
    const idleId =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(loadAnalytics, { timeout: ANALYTICS_DELAY })
        : null;
    const timerId = idleId ? null : window.setTimeout(loadAnalytics, ANALYTICS_DELAY);

    return () => {
      if (idleId) {
        window.cancelIdleCallback(idleId);
      }
      if (timerId) {
        window.clearTimeout(timerId);
      }
    };
  }, []);

  useEffect(() => {
    if (!canLoadAnalytics || window.location.hostname === "localhost") {
      return;
    }

    pageview(`${pathname}${window.location.search}`);
  }, [canLoadAnalytics, pathname]);

  if (!canLoadAnalytics) {
    return null;
  }

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname + window.location.search,
          });
        `}
      </Script>
    </>
  );
};