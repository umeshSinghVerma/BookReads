import { NextRequest, NextResponse } from "next/server";
import getBookData from "../utilFunctions/bookData";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const booksurl = JSON.stringify(searchParams.get('bookUrl'))
    console.log("this  is book url ", booksurl)
    const book = await getBookData(booksurl);
    return NextResponse.json(book,{status:200})
};
