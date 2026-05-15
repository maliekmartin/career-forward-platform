import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

/**
 * GET /api/jobs/search
 * Search for job listings with filters, sorting, and pagination
 * Public endpoint (no authentication required)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const query = searchParams.get("q") || "";
    const location = searchParams.get("location") || "";
    const jobType = searchParams.get("jobType") || "";
    const workMode = searchParams.get("workMode") || "";
    const industry = searchParams.get("industry") || "";
    const source = searchParams.get("source") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const sortBy = searchParams.get("sortBy") || "newest";

    // Build where clause
    const where: Prisma.JobListingWhereInput = {
      isActive: true,
    };

    // Search query (title, company, or description)
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { company: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    // Filters
    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (jobType) {
      where.jobType = jobType;
    }

    if (workMode) {
      where.workMode = workMode;
    }

    if (industry) {
      where.industry = { contains: industry, mode: "insensitive" };
    }

    if (source) {
      where.source = source as "jsearch" | "usajobs";
    }

    // Build orderBy clause
    let orderBy: Prisma.JobListingOrderByWithRelationInput = { postedDate: "desc" };

    if (sortBy === "pay-high") {
      orderBy = { salaryMax: { sort: "desc", nulls: "last" } };
    } else if (sortBy === "pay-low") {
      orderBy = { salaryMin: { sort: "asc", nulls: "last" } };
    }

    // Execute query with pagination
    const [jobs, totalCount] = await Promise.all([
      prisma.jobListing.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.jobListing.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      jobs,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error("[API] Job search error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search jobs",
        jobs: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      },
      { status: 500 }
    );
  }
}
