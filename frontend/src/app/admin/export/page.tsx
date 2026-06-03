"use client";

/**
 * @module admin/export
 *
 * Excel export page. One-click download of the entire CMS dataset
 * as a multi-sheet .xlsx workbook via /api/export/excel. Shows live
 * row-count summary cards via /api/export/counts.
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2, FileSpreadsheet, Mail, CalendarCheck, Heart, Calendar } from "lucide-react";

type Counts = {
  event_registrations: number;
  contact_forms: number;
  donations: number;
  events: number;
};

export default function ExportPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/export/counts")
      .then((r) => r.json())
      .then(setCounts)
      .catch(() => setError("Failed to load counts"));
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    try {
      const res = await fetch("/api/export/excel");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flc-miami-data-${stamp}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setError("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const cards = [
    { label: "Event Registrations", icon: CalendarCheck, key: "event_registrations" as const, color: "text-blue-600 bg-blue-50" },
    { label: "Contact Submissions", icon: Mail, key: "contact_forms" as const, color: "text-emerald-600 bg-emerald-50" },
    { label: "Donations", icon: Heart, key: "donations" as const, color: "text-rose-600 bg-rose-50" },
    { label: "Events", icon: Calendar, key: "events" as const, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div data-testid="admin-export-page">
      <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-1">
        <FileSpreadsheet className="text-emerald-600" />
        Data Export
      </h1>
      <p className="text-sm text-slate-500 mb-8">
        Download all website data — event registrations, contact form
        submissions, donations, and events — as a single Excel workbook.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, icon: Icon, key, color }) => (
          <Card key={key} data-testid={`count-card-${key}`}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {counts ? counts[key] : "—"}
              </div>
              <div className="text-sm text-slate-500 mt-1">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Download Excel workbook</CardTitle>
          <CardDescription>
            Generates a fresh <code>.xlsx</code> file with all current data.
            Includes a Summary sheet plus one sheet per collection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            size="lg"
            onClick={handleDownload}
            disabled={downloading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            data-testid="download-excel-button"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating workbook…
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download Excel
              </>
            )}
          </Button>
          {error && (
            <p className="text-sm text-red-600 mt-3" data-testid="export-error">
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
