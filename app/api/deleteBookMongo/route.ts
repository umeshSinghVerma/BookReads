import { NextRequest, NextResponse } from "next/server";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const CreateToken = (email: string | null, password: string | null) => {
    if (email && password) {
        return jwt.sign({ email, password }, process.env.SECRET_KEY, { expiresIn: '3d' })
    }
}
export async function POST(request: NextRequest) {
    try {
        // Extract email from URL parameters
        const body = await request.json();
        const email = body.email;
        const deleteBook = body.bookTitle;

        const authHeader = request.headers.get('Authorization');
        const token = authHeader ? authHeader.split(' ')[1] : null;
        const JWTCheck = jwt.verify(token, process.env.SECRET_KEY);
        if (JWTCheck.email !== email) {
            return NextResponse.json({ error: "User is not registered" }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                email: email // Update the property to 'email' instead of 'id'
            }
        });
        if(!user){
            return NextResponse.json({error:"user is not registered"},{status:400})
        }
        let books = user?.books;
        let UpdatedBooks = (books??[])?.filter((books:any)=>{
            return books.title!=deleteBook
        })
        if (user) {
            const UpdatedUser = await prisma.user.update(
                {
                    where: {
                        email: email
                    },
                    data: {
                        books:UpdatedBooks as Prisma.InputJsonValue[] 
                      }
                }
            )
            return NextResponse.json({ success: true,UpdatedUser }, { status: 200 });
        } else {
            return NextResponse.json({ error: "User is not registered" }, { status: 400 });
        }
    }
    catch (e) {
        return NextResponse.json(e, { status: 200 })
    }
}