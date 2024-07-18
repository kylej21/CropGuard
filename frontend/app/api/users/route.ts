// app/api/users.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest){
  // cllient logic actually goes and fetches
  const client = await sql.connect();
  const { rows } = await client.sql`SELECT * FROM users`;
  console.log(rows)
  return NextResponse.json(rows, {status:201});
}