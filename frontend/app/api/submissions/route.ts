// app/api/users.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function POST(request: NextRequest){
  // cllient logic actually goes and fetches
  // noStore makes the browser not cache the query
  noStore();
  const client = await sql.connect();
  try{
    const body = await request.json();
    const { rows } = await client.sql`SELECT * FROM submissions WHERE username = ${body.username}`;
    return NextResponse.json({ data: rows.map(row => [row.result, row.description]) }, { status: 200 });
  }catch(error){
    console.error('Error processing request:', error);
    return NextResponse.json({data:[]}, {status: 400 });
  }
}