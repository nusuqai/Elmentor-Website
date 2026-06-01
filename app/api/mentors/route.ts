import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = searchParams.get("lang") || "en";
    const offset = Number(searchParams.get("offset") || 0);

    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : undefined;

    const agentUrl = process.env.AGENT_URL;

    if (!agentUrl) {
      console.error("AGENT_URL is not defined in environment variables");
      return NextResponse.json(
        { error: "Agent server is not configured" },
        { status: 500 },
      );
    }

    const queryParams = new URLSearchParams({
      lang,
      offset: offset.toString(),
      ...(limit !== undefined ? { limit: limit.toString() } : {}),
    });

    const upstreamUrl = `${agentUrl}/mentors?${queryParams.toString()}`;
    const upstreamRes = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!upstreamRes.ok) {
      console.error(`Upstream agent returned status ${upstreamRes.status}`);
      return NextResponse.json(
        { error: `Upstream agent error (${upstreamRes.status})` },
        { status: 502 },
      );
    }

    const data = await upstreamRes.json();

    if (data && typeof data === "object" && !Array.isArray(data)) {
      const hasMore = data?.count + data?.offset < data?.total;
      console.log("Is there more data?", hasMore);
      return NextResponse.json({
        mentors: data.mentors || [],
        total:
          data.total !== undefined ? data.total : (data.mentors || []).length,
        hasMore,
      });
    } else if (Array.isArray(data)) {
      const hasMore =
        limit !== undefined ? offset + limit < data.length : false;
      return NextResponse.json({
        mentors: data,
        total: data.length,
        hasMore,
      });
    }

    return NextResponse.json({
      mentors: [],
      total: 0,
      hasMore: false,
    });
  } catch (error) {
    console.error("Error in mentors route handler:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
