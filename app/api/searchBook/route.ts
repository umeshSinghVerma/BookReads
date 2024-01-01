import { NextRequest, NextResponse } from "next/server";
import bookSearch from "../utilFunctions/bookSearch";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const bookserachName = JSON.stringify(searchParams.get('book'))
    const bookName = await bookSearch(bookserachName);
    return NextResponse.json(bookName,{status:200})
};
