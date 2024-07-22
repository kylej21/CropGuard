import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function POST(request: NextRequest){
  // cllient logic actually goes and fetches
  // noStore makes the browser not cache the query
  noStore();
  const client = await sql.connect();
  try{
    // fetch data
    const body = await request.json();
    const { rows } = await client.sql`SELECT result, description FROM submissions WHERE username= ${body.username}`;
    console.log("rows -", rows)
    // process data into a map of counts
    const results: string[] = rows.map(row => row.result);

    const occurrenceMap = new Map<string, number>();
    results.forEach(result => {
      occurrenceMap.set(result, (occurrenceMap.get(result) || 0) + 1);
    });

    // Sort required to preserve the most common charaacteristic.
    // descending sort -> O(nlogn)
    const sortedCounts = Array.from(occurrenceMap.values()).sort((a, b) => b - a);

    // return only the top 5.
    const top5 = sortedCounts.slice(0,5);
    console.log("top5 - ",top5);
    return NextResponse.json({ data: top5 }, { status: 200 });
  }catch(error){
    console.error('Error processing request:', error);
    return NextResponse.json({data:[]}, {status: 400 });
  }
}