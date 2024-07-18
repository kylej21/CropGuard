// app/api/users.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
export async function POST(request: NextRequest){
    noStore();

    const body = await request.json();
    const client = await sql.connect();
    console.log('add request: '+ body.username)
    try {
        await client.sql`INSERT INTO users (username, password) VALUES (${body.username}, ${body.password})`;
    return NextResponse.json("successfully added: "+body.username+" to users", {status:201});
  } catch (error) {
    return NextResponse.json("error", {status:500});
  }
}