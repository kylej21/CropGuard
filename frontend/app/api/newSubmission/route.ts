// app/api/users.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

const fetchDescription = async () => {
    // Gemini description + processing of the image
    // for now return Tomato Blight
    return ["Tomato Blight","Late Tomato Blight Late tomato blight is caused by..."];
}
export async function POST(request: NextRequest){
    noStore();

    const body = await request.json();
    const client = await sql.connect();
    console.log('add submission: '+ body.username)
    const [response,description] = await fetchDescription() // <- put image as param later
    console.log(`${body.username}, ${response}, ${description}`)
    try {
        await client.sql`INSERT INTO submissions (username,result,description) VALUES (${body.username}, ${response}, ${description})`;
    return NextResponse.json("successfully added: "+body.username+" to submissions", {status:201});
    } catch (error) {
      console.log(error)
      return NextResponse.json("error", {status:500});
    }
}