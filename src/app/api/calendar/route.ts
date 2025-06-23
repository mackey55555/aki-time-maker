import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Authorizationヘッダーからアクセストークンを取得
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No access token' }, { status: 401 });
  }
  const accessToken = authHeader.replace('Bearer ', '');

  // Google Calendar APIから予定を取得
  const calendarApiUrl =
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=' +
    new Date().toISOString();
  const googleRes = await fetch(calendarApiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const events = await googleRes.json();

  return NextResponse.json(events);
} 