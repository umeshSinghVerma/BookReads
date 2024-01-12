import { NextRequest, NextResponse } from "next/server";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import { PrismaClient } from '@prisma/client'
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
        const password = body.password;
        const email = body.email;
        const user = await prisma.user.findFirst({
            where: {
                email: email // Update the property to 'email' instead of 'id'
            }
        });
        if (user) {
            const PasswordCheck = await bcrypt.compare(password, user.password)
            if (!PasswordCheck) {
                return NextResponse.json({ error: "Password is invalid" }, { status: 400 });
            }
            return NextResponse.json({ success: true, token: CreateToken(email, password) }, { status: 200 });
        } else {
            return NextResponse.json({ error: "User is not registered" }, { status: 400 });
        }
    }
    catch (e) {
        return NextResponse.json(e, { status: 200 })
    }
}