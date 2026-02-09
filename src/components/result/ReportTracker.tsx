"use client";

import { useEffect, useRef } from "react";
import { trackPurchaseComplete, trackReportView } from "@/lib/gtag";

interface ReportTrackerProps {
  attemptId: string;
  grade: string;
  price: number;
}

export default function ReportTracker({ attemptId, grade, price }: ReportTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      trackPurchaseComplete(attemptId, price);
      trackReportView(attemptId, grade);
      hasTracked.current = true;
    }
  }, [attemptId, grade, price]);

  return null;
}
