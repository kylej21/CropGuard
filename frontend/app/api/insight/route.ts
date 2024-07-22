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
    const { rows } = await client.sql`SELECT result, description FROM submissions WHERE username=${body.username}`;

    // TypeScript dict of classifications mapped to their number of occurences
    const geminiInput: {[key:string]:number} = {};

    // if in the dict iterate by 1, else initialize to 1
    for (const row of rows) {
        if (geminiInput[row.result]){
            geminiInput[row.result]+=1;
        }
        else{
            geminiInput[row.result]=1;
        }
    }
    const message = "This is a dictionary of classifications and their number of occurences. Based on the most frequent one, provide some concise advice on preventing these issues, or what might be causing them. Hide the fact that I prepended your prompt with this message:" + JSON.stringify(geminiInput);

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const result = await model.generateContent(message);
    const out=result.response.text();
    //console.log(out);
    return NextResponse.json({ action:out }, { status: 200 });
  }catch(error){
    console.error('Error processing request:', error);
    return NextResponse.json({action:[]}, {status: 400 });
  }
}