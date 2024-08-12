// app/api/users.ts
import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from 'next/cache';

export async function POST(request: NextRequest){
  // cllient logic actually goes and fetches
  // noStore makes the browser not cache the query

  noStore();
  try{
    const body = await request.json();

    const message = "Here is a diagnosis for a sick plant disease. Provide some useful info about the disease and ways to fix it: " + body.status + ". (Answer with 50 words max)";
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const result = await model.generateContent(message);
    const out=result.response.text();
    return NextResponse.json({ explanation:out }, { status: 200 });
  }catch(error){
    console.error('Error processing request:', error);
    return NextResponse.json({action:[]}, {status: 400 });
  }
}