'use client'
import openai from "@/openAi";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI('AIzaSyAjSTF_9A09G_1NZsPa3oBk9D34XIZeOQU');

import client from "@/sanity/client";
import React, { useEffect, useState } from 'react'
async function uploadSummary(bookName: string, summary:string) {
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
    console.log("i am h")
    let keyIdeas: Array<string> = [];
    let summaries: Array<string> = [];
    let str = '';
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Summarize the plot ofthe book ${bookName} by ${authorName} and aim for a length of approximately 500 words.`


    const result = await model.generateContentStream(prompt);
    let sum = '';
    for await (const chunk of result.stream) {
        const data = chunk.text();
        sum += data;
        setData(sum);
    }
    uploadSummary(bookName,sum)
}
interface SummaryType {
    type: string;
    Summary: any;
}

export default function Summary({ bookName, authorName }: { bookName: string, authorName: string }) {
    const [data, setData] = useState<string>('');
    useEffect(() => {
        getSummaryFromSanity(bookName, authorName, setData);
    }, [])
    return (
        <div>
            <p className='md:text-xl font-bold text-blue-950'>Summary</p>
            <div className="my-4">
                {data}
            </div>
        </div>
    )
}
