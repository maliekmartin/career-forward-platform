"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Users, Clock, RefreshCw } from "lucide-react";

interface WaitlistStats {
  total: number;
  today: number;
  thisWeek: number;
}

interface RecentEntry {
  firstName: string;
  email: string;
  region: string;
  createdAt: string;
}

export default function AdminWaitlistPage() {
  const [stats, setStats] = useState<WaitlistStats | null>(null);
  const [recentEntries, setRecentEntries] = useState<RecentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/waitlist");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentEntries(data.recent);
      }
    } catch (error) {
      console.error("Failed to fetch waitlist data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/waitlist/export");
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `waitlist-export-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const regionLabels: Record<string, string> = {
    northwest: "Northwest",
    southwest: "Southwest",
    midwest: "Midwest",
    northeast: "Northeast",
    southeast: "Southeast",
    south: "South",
    mountain: "Mountain",
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Waitlist Management</h1>
          <p className="text-gray-600">View and export waitlist entries</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={handleExport} disabled={exporting}>
            <Download className="h-4 w-4 mr-2" />
            {exporting ? "Exporting..." : "Export to CSV"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Signups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              <span className="text-3xl font-bold">
                {loading ? "..." : stats?.total ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-600" />
              <span className="text-3xl font-bold">
                {loading ? "..." : stats?.today ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>This Week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-600" />
              <span className="text-3xl font-bold">
                {loading ? "..." : stats?.thisWeek ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Signups</CardTitle>
          <CardDescription>Latest waitlist entries</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : recentEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No waitlist entries yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Region</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEntries.map((entry, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3 px-4">{entry.firstName}</td>
                      <td className="py-3 px-4 text-gray-600">{entry.email}</td>
                      <td className="py-3 px-4">{regionLabels[entry.region] || entry.region}</td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {formatDate(entry.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
