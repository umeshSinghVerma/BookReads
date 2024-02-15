'use client'
import openai from "@/openAi";
const { GoogleGenerativeAI } = require("@google/generative-ai");

import client from "@/sanity/client";
import React, { useEffect, useState } from 'react'
async function uploadSummary(bookName: string, summary: string) {
    client
        .patch({ query: `*[_type == "book" && title == "${bookName}" ]` })
        .set({ wholeSummary: summary })
        .commit({ autoGenerateArrayKeys: true })
        .then(() => {
        })
        .catch((err) => {
            console.error('the update failed: ', err.message)
        })
}

async function getSummaryFromSanity(bookName: string, authorName: string, setData: React.Dispatch<React.SetStateAction<string>>) {
    const beta = await client.fetch(`*[_type == "book" && title == "${bookName}" ]{wholeSummary}`, { cache: 'no-store' });
    if (beta.length == 0) {
        getSummaryFromGPT(bookName, authorName, setData);
    }
    else {
        if (!beta[0].wholeSummary) {
            getSummaryFromGPT(bookName, authorName, setData)
        } else {
            setData(beta[0].wholeSummary)
        }
    }
}

async function getSummaryFromGPT(bookName: string, authorName: string, setData: any) {
    try {
        const genAI = new GoogleGenerativeAI('AIzaSyAA7_Md8AjKl0Qz5Cp1Ja6DUDLhEFqLue8');
        console.log("i am h");
        let keyIdeas: Array<string> = [];
        let summaries: Array<string> = [];
        let str = '';
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt1 = `Summarize the plot of the book ${bookName} by ${authorName} and aim for the detailed long summary atleast 1000 lines to cover all essential things  which a strandard very good summary in the form of html break it down in lists paragraphs divs etc intelligently also add relavent tailwnd css classes,do something attractive css so that It will be helpful to visitors and visually appealing like google's theme ,do not write any text greater than tailwind class text-xl ,also add relavent margin and padding between elements and also take care of responsiveness while adding tailwind css classes and most importantly Do not write anything irrelevant like '''html ''' so on also do not try to give the entire html document s this data is going to display in the next js application so I have already set up the tailwind css into the project to do not include the css links ets give the data in div
        `;

        const prompt = `Generate an engaging and comprehensive book summary for the book titled "${bookName}" written by ${authorName}. Ensure that the summary provides enough details to give users a fair idea about the essence of the book. Make the summary visually appealing and responsive using HTML elements like paragraphs and divs, with relevant Tailwind CSS classes. Limit the text size to Tailwind class text-lg or smaller. The goal is to create a summary that captivates users and leaves them with a strong understanding of the book.
        `

        const result = await model.generateContentStream(prompt);
        let sum = '';
        for await (const chunk of result.stream) {
            const data = chunk.text();
            sum += data;
            setData(sum);
        }

        uploadSummary(bookName, sum);
    } catch (error: any) {
        // Handle the error
        console.error("Error in getSummaryFromGPT:", error.message);
        // Optionally, you can rethrow the error to let the caller handle it as well
        throw error;
    }
}

interface SummaryType {
    type: string;
    Summary: any;
}

export default function Summary({ bookName, authorName }: { bookName: string, authorName: string }) {
    const [data, setData] = useState<string>('');
    useEffect(() => {
        if (bookName && authorName) { getSummaryFromSanity(bookName, authorName, setData); }
    }, [])
    return (
        <div>
            <p className='md:text-xl font-bold text-blue-950'>Summary</p>
            <main className="my-4" dangerouslySetInnerHTML={{ __html: data }}></main>
            {data!='' && (<button className="p-2 border-0 md:text-base text-xs px-4 bg-green-400 rounded" onClick={()=>{
                setData("");
                getSummaryFromGPT(bookName,authorName,setData);
            }}>Regenerate</button>)}
        </div>
    )
}
