// app/api/users.ts
import { NextRequest, NextResponse } from "next/server";
import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';

export async function POST(request: NextRequest){
    noStore();

    const client = await sql.connect();

    try {
        console.log(request)
        const body = await request.json();
        console.log(request.text())
        if (!body || !body.username || !body.password) {
            throw new Error('Invalid request body');
        }

        const { rows } = await client.sql`SELECT * FROM users WHERE username = ${body.username} AND password = ${body.password}`;
        console.log(rows);
        if (rows.length === 0) {
          return NextResponse.json({ error: 'Incorrect username or password' }, { status: 401 });
        }
        console.log(NextResponse.json({rows:rows ,status: 200 }));
        return NextResponse.json({data:rows ,status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({data:[], status: 400 });
    }
}
