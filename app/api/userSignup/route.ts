const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import AWS from 'aws-sdk'

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const db = new AWS.DynamoDB.DocumentClient()

const Table = 'wittpad-users'


const CreateToken = (email: string | null) => {
    if (email) {
        return jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '3d' })
    }
}
const createOrUpdate = async (data = {}) =>{
    const params = {
        TableName: Table,
        Item: data
    }

    try{
        await db.put(params).promise()
        return { success: true }
    } catch(error){
        return { success: false}
    }
}

// Read all users
const readAllUsers = async()=>{
    const params = {
        TableName: Table
    }

    try{
        const { Items = [] } = await db.scan(params).promise()
        return { success: true, data: Items }

    } catch(error){
        return { success: false, data: null }
    }

}

// Read Users by ID
const getUserById = async (value:string, key = 'id') => {
    const paramst = {
        TableName: Table
    }
    const { Items = [] } = await db.scan(paramst).promise()
    console.log('this is items',Items);
    const params = {
        TableName: Table,
        Key: {
            [key]: value
        }
    }
    try {
        const { Item = {} } =  await db.get(params).promise()
        return { success: true, data: Item }
    } catch (error) {
        return {  success: false, data: null}        
    }
}

// Delete User by ID
const deleteUserById = async(value:string, key = 'id' ) => { 
    const params = {
        TableName: Table,
        Key: {
            [key]: parseInt(value)
        }
    }
        
    try {
        await db.delete(params).promise()
        return {  success: true }

    } catch (error) {
        return{ success: false }
    }
}
export async function POST(request: Request) {
    const body = await readRequestBody(request.body);
    const email = body.id;
    const password = body.password;
    console.log("this is body ", body);
    let { success, data } = await getUserById(email)
    console.log('function ', success, data);
    if (success) {
        if (data?.id) {
            success = true;
        } else {
            success = false;
        }
    }
    if (success) {
        if (data) {
            const isValidPassword = await bcrypt.compare(password, data.password);
            if (isValidPassword) {
                return Response.json({ success: true, token: CreateToken(email) })
            } else {
                return Response.json({ success: false, message: 'User already exists. Incorrect Password' }, { status: 400 })
            }
        }
    } else {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const body = {
            id: email,
            password: hash
        }
        const { success } = await createOrUpdate(body);
        const token = CreateToken(email);
        if (success) {
            return Response.json({ success: success, token: CreateToken(email) })
        }
        else {
            return Response.json({ success: success, message: "Error" })
        }
    }



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
