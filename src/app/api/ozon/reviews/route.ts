import { NextResponse } from 'next/server';
import reviewsData from '../../../../data/ozon/reviews_and_questions.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    return NextResponse.json(reviewsData);
  } catch (error) {
    console.error('Error serving reviews:', error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}

