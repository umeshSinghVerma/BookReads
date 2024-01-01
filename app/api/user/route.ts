import axios from 'axios';
import { createOrUpdate, deleteUserById, getUserById, readAllUsers } from './db.js'
const jwt = require('jsonwebtoken');

export async function GET(request: Request) {
    try {
        // Extract email from URL parameters
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        // Extract token from Authorization header
        const authHeader = request.headers.get('Authorization');
        const token = authHeader ? authHeader.split(' ')[1] : null;

        // Verify the JWT token
        const jwtdata = jwt.verify(token, process.env.SECRET_KEY);
        if (jwtdata.email == email) {
            const { success, data } = await getUserById(email);
            if (success) {
                if (data?.id) {
                    return new Response(JSON.stringify({ success, data }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                }
                return new Response(JSON.stringify({ success: false }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: "Error first" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Default response for other cases
    return new Response(JSON.stringify({ success: false, message: "Error second" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(request: Request) {
    const body = await readRequestBody(request.body);
    try {
        // Extract email from URL parameters
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        // Extract token from Authorization header
        const authHeader = request.headers.get('Authorization');
        const token = authHeader ? authHeader.split(' ')[1] : null;
        const jwtdata = jwt.verify(token, process.env.SECRET_KEY);

        const previousData = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user?email=${body.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000,https://wittpad-alpha.vercel.app',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
            }
        });
        const oldData = { ...previousData.data.data };
        console.log('this is prev data ', oldData);
        let newData;
        if (oldData?.savedBooks) {
            newData = {
                id: oldData.id,
                password: oldData.password,
                savedBooks: [...oldData.savedBooks, body.savedBooks]
            };
        } else {
            newData = {
                id: oldData.id,
                password: oldData.password,
                savedBooks: [body.savedBooks]
            };
        }
        console.log("this is new data ", newData);

        // Verify the JWT token
        console.log(body, jwtdata.email);
        if (body.id == email) {
            const { success } = await createOrUpdate(newData);
            if (success) {
                return new Response(JSON.stringify({ success }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: "Error first" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Default response for other cases
    return new Response(JSON.stringify({ success: false, message: "Error second" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
}
export async function DELETE(request: Request) {
    const body = await readRequestBody(request.body);
    try {
        // Extract email from URL parameters
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        // Extract token from Authorization header
        const authHeader = request.headers.get('Authorization');
        const token = authHeader ? authHeader.split(' ')[1] : null;
        const jwtdata = jwt.verify(token, process.env.SECRET_KEY);

        const previousData = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user?email=${body.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000,https://wittpad-alpha.vercel.app',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
            }
        });
        const oldData = { ...previousData.data.data };
        const oldSavedBooks = oldData.savedBooks;

        const newSavedBooks = oldSavedBooks.filter((book: any) => book.title != body.removeBook.title)
        const newData = {
            id: oldData.id,
            password: oldData.password,
            savedBooks: [...newSavedBooks]
        };
        console.log("this is new data ", newData);

        // Verify the JWT token
        console.log(body, jwtdata.email);
        if (body.id == email) {
            const { success } = await createOrUpdate(newData);
            if (success) {
                return new Response(JSON.stringify({ success }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: "Error first" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Default response for other cases
    return new Response(JSON.stringify({ success: false, message: "Error second" }), { status: 500, headers: { 'Content-Type': 'application/json' } });
}

async function readRequestBody(body: ReadableStream | null): Promise<any> {
    if (body) {
        const reader = body.getReader();
        const chunks: Uint8Array[] = [];
        let result;

        while (!(result = await reader.read()).done) {
            chunks.push(result.value);
        }

        const buffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
        let offset = 0;
        chunks.forEach((chunk) => {
            buffer.set(chunk, offset);
            offset += chunk.length;
        });

        const text = new TextDecoder().decode(buffer);
        return JSON.parse(text);
    }
}
