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
    console.log("in fetchDecription",body);
    const values = await (await payload).json();
    console.log(values)
    // for now return Tomato Blight
    return [values.status,values.explanation];
}
export async function POST(request: NextRequest){
    noStore();
    console.log("before trying anything in api route")
    
    try {
        const formData = await request.formData();
        const [username, result, description] = [formData.get('username'), formData.get('result'), formData.get('description')];


        const client = await sql.connect();



        console.log(`${username}, ${result}, ${description}`);

        await client.sql`INSERT INTO submissions (username, result, description) VALUES (${username?.toString()}, ${result?.toString()}, ${description?.toString()})`;

        console.log("Successfully added!")
        return NextResponse.json("successfully added: " + username + " to submissions", { status: 201 });
    } catch (error) {
        console.error('Error in POST handler:', error);
        return NextResponse.json("error", { status: 500 });
    }
}