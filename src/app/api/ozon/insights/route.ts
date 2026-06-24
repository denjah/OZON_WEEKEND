import { NextResponse } from 'next/server';
import insightsData from '../../../../data/ozon/insights.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    return NextResponse.json(insightsData);
  } catch (error) {
    console.error('Error serving insights.json:', error);
    return NextResponse.json({}, { status: 500 });
  }
}

