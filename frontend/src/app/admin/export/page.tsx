"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2, FileSpreadsheet, Mail, CalendarCheck, Heart, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    {
      label: "Event Registrations",
      icon: CalendarCheck,
      key: "event_registrations" as const,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Contact Submissions",
      icon: Mail,
      key: "contact_forms" as const,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Donations",
      icon: Heart,
      key: "donations" as const,
      color: "text-rose-600 bg-rose-50",
    },
    {
      label: "Events",
      icon: Calendar,
      key: "events" as const,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" data-testid="admin-export-page">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 flex items-center gap-3">
            <FileSpreadsheet className="text-emerald-600" />
            Data Export
          </h1>
          <p className="text-slate-600 mt-2">
            Download all website data — event registrations, contact form
            submissions, donations, and events — as a single Excel workbook
            with one sheet per collection.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {cards.map(({ label, icon: Icon, key, color }) => (
            <Card key={key} data-testid={`count-card-${key}`}>
              <CardContent className="p-5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${color}`}
                >
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
            <p className="text-xs text-slate-500 mt-4">
              Tip: bookmark this page for quick monthly data backups. The file
              opens directly in Excel, Numbers, or Google Sheets.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
