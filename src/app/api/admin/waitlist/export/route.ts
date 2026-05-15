import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";

/**
 * GET - Export all waitlist entries as CSV
 * Requires admin authentication
 */
export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all waitlist entries
    const entries = await prisma.waitlistEntry.findMany({
      orderBy: { createdAt: "desc" },
    });

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

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting waitlist:", error);
    return NextResponse.json(
      { error: "Failed to export waitlist" },
      { status: 500 }
    );
  }
}
