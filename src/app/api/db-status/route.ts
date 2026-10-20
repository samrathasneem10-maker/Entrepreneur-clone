import { NextResponse } from 'next/server';
import { testDbConnection } from '@/lib/db';

export async function GET() {
  const status = await testDbConnection();
  return NextResponse.json(status, {
    status: status.connected ? 200 : 503,
  });
}
