"use client";

import React from "react";
import StudentEngagementAnalytics from "@/components/StudentEngagementAnalytics";

export default function AdminEngagementAnalyticsPage() {
  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
      <StudentEngagementAnalytics role="ADMIN" />
    </div>
  );
}
