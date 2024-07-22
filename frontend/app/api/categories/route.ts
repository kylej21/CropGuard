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

    // sort the keys based on the value of their values, in descending order
    const sortedCategories = Array.from(occurrenceMap.keys()).sort((a, b) => {
        const countA = occurrenceMap.get(a)!; 
        const countB = occurrenceMap.get(b)!; 
        return countB - countA; // b-a puts in descending order... don't ask how this code works idk
      });

    console.log(sortedCategories)
    // return only the top 5.
    const top5 = sortedCategories.slice(0,5);
    console.log("top5 - ",top5);
    return NextResponse.json({ data: top5 }, { status: 200 });
  }catch(error){
    console.error('Error processing request:', error);
    return NextResponse.json({data:[]}, {status: 400 });
  }
}