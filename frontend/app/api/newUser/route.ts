// app/api/users.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest){
    const body = await request.json();
    console.log('add request: '+ body.username)
    try {
        await sql`INSERT INTO users (username, password) VALUES (${body.username}, ${body.password})`;
    return NextResponse.json("successfully added: "+body.username+" to users", {status:201});
  } catch (error) {
    return NextResponse.json("error", {status:500});
  }
}