import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";

/**
 * GET - Export all waitlist entries as CSV
 * Requires admin authentication
 * CRITICAL: This exports all waitlist data - ensure data is never lost
 */
export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      console.log("[WAITLIST EXPORT] Unauthorized export attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true, email: true },
    });

    if (user?.role !== "ADMIN") {
      console.log(`[WAITLIST EXPORT] Forbidden export attempt by user: ${user?.email || session.userId}`);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log(`[WAITLIST EXPORT] Admin ${user.email} initiating waitlist export`);

    // Fetch all waitlist entries with retry logic
    let entries;
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        entries = await prisma.waitlistEntry.findMany({
          orderBy: { createdAt: "desc" },
        });
        console.log(`[WAITLIST EXPORT] ✅ Successfully fetched ${entries.length} entries`);
        break;
      } catch (dbError: any) {
        retries++;
        console.error(`[WAITLIST EXPORT] Database error on attempt ${retries}/${maxRetries}:`, dbError);

        if (retries >= maxRetries) {
          throw dbError;
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, retries)));
      }
    }

    if (!entries || entries.length === 0) {
      console.log("[WAITLIST EXPORT] No entries found to export");
      // Return empty CSV with headers
      const headers = [
        "First Name",
        "Last Name",
        "Email",
        "Region",
        "Referral Code",
        "Referred By",
        "Status",
        "Registered At",
      ];
      const csvContent = headers.join(",");
      const filename = `waitlist-export-${new Date().toISOString().split("T")[0]}.csv`;

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // Build CSV content
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Region",
      "Referral Code",
      "Referred By",
      "Status",
      "Registered At",
    ];

    const rows = entries.map((entry) => [
      entry.firstName,
      entry.lastName,
      entry.email,
      entry.region,
      entry.referralCode,
      entry.referredBy || "",
      entry.status,
      entry.createdAt.toISOString(),
    ]);

    // Escape CSV values
    const escapeCSV = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    // Return as downloadable CSV file
    const filename = `waitlist-export-${new Date().toISOString().split("T")[0]}.csv`;

    console.log(`[WAITLIST EXPORT] ✅ Export complete: ${entries.length} entries exported by ${user.email}`);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("[WAITLIST EXPORT] ❌ Critical error during export:", error);
    return NextResponse.json(
      {
        error: "Failed to export waitlist",
        message: "We're experiencing technical difficulties. Please try again or contact support if this persists.",
      },
      { status: 500 }
    );
  }
}
