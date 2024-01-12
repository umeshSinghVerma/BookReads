import { NextRequest, NextResponse } from "next/server";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const CreateToken = (email: string | null,password:string|null) => {
    if (email && password) {
        return jwt.sign({ email,password }, process.env.SECRET_KEY, { expiresIn: '3d' })
    }
}

export async function POST(request:NextRequest){
    try{
        const body = await request.json();
        const email = body.email;
        const password = body.password;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const User = await prisma.user.create({
            data:{email,password:hashPassword}
        })
        return NextResponse.json({success:true,token:CreateToken(email,password),user:User},{status:200})
    }
    catch(e){
        return NextResponse.json(e,{status:200})
    }
}