"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { GA_ID, isGAEnabled, pageview } from "@/lib/gtag";
import { GADS_ID, isGAdsEnabled } from "@/lib/gads";
import { META_PIXEL_ID, isMetaPixelEnabled } from "@/lib/meta-pixel";
import { captureUTM } from "@/lib/utm";

function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // UTMパラメータを初回訪問時にキャプチャ
  useEffect(() => {
    captureUTM();
  }, []);

  useEffect(() => {
    if (!isGAEnabled()) return;
    const url =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    pageview(url);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!isMetaPixelEnabled()) return;
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}

export default function GoogleAnalytics() {
  // GA4もGoogle AdsもMeta Pixelも全て無効なら何も描画しない
  const anyEnabled = isGAEnabled() || isGAdsEnabled() || isMetaPixelEnabled();
  if (!anyEnabled) return null;

  // Google Ads用config行を動的生成
  const gadsConfigLine = isGAdsEnabled()
    ? `gtag('config', '${GADS_ID}');`
    : "";

  return (
    <>
      {/* ===== Google Analytics 4 + Google Ads ===== */}
      {isGAEnabled() && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
                ${gadsConfigLine}
              `,
            }}
          />
        </>
      )}

      {/* ===== Meta Pixel (Facebook/Instagram) ===== */}
      {isMetaPixelEnabled() && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}

      {/* ===== Meta Pixel noscript fallback ===== */}
      {isMetaPixelEnabled() && (
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      )}

      <Suspense fallback={null}>
        <PageTracker />
      </Suspense>
    </>
  );
}
