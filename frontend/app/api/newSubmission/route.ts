// app/api/users.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

const fetchDescription = async (body: any) => {
    // Gemini description + processing of the image

    const payload = fetch('http://127.0.0.1:5000/upload/', {
        method: 'POST',
        body: body
    })
    
    const values = await (await payload).json();
    // for now return Tomato Blight
    return [values.status,values.explanation];
}
export async function POST(request: NextRequest){
    noStore();
    const body = await request.json();
    console.log(body)
    const client = await sql.connect();
    console.log('add submission: '+ body.username)
    const [response,description] = await fetchDescription(body) // <- put image as param later
    console.log(`${body.username}, ${response}, ${description}`)
    try {
        await client.sql`INSERT INTO submissions (username,result,description) VALUES (${body.username}, ${response}, ${description})`;
    return NextResponse.json("successfully added: "+body.username+" to submissions", {status:201});
    } catch (error) {
      console.log(error)
      return NextResponse.json("error", {status:500});
    }
}