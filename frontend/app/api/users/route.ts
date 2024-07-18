// app/api/users.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(request: NextRequest){
  // cllient logic actually goes and fetches
  // noStore makes the browser not cache the query
  noStore();
  const client = await sql.connect();
  const { rows } = await client.sql`SELECT * FROM users`;
  console.log(rows)
  return NextResponse.json(rows, {status:201});
}