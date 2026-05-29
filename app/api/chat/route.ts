import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Check if agent is enabled
  const enabled = process.env.AGENT_ENABLED !== 'false';
  if (!enabled) {
    return NextResponse.json(
      {
        text: 'The matching agent is currently offline for maintenance. Please check back soon or browse our mentors directly.',
        questionPlan: null,
        rankedMatches: [],
        matchEvaluation: null,
        followUpQuestions: ['Browse mentors instead'],
        sources: null,
      },
      { status: 503 }
    );
  }

  const agentUrl =
    process.env.AGENT_URL ||
    'https://prepared-dyanna-nusuqai-demo-1a5b158b.koyeb.app/elmentor/query';

  try {
    const body = await req.json();
    const sessionId = req.headers.get('mcp-session-id') || '';

    const upstream = await fetch(agentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionId ? { 'mcp-session-id': sessionId } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => 'Unknown error');
      console.error(`Agent returned ${upstream.status}: ${errText}`);
      return NextResponse.json(
        {
          text: `The matching agent returned an error (${upstream.status}). Please try again.`,
          questionPlan: null,
          rankedMatches: [],
          matchEvaluation: null,
          followUpQuestions: null,
          sources: null,
        },
        { status: 502 }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Agent proxy error:', err);
    return NextResponse.json(
      {
        text: 'Unable to connect to the matching agent. Please try again later.',
        questionPlan: null,
        rankedMatches: [],
        matchEvaluation: null,
        followUpQuestions: null,
        sources: null,
      },
      { status: 500 }
    );
  }
}
