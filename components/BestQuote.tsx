'use client'
import openai from "@/openAi";
import client from "@/sanity/client";
import { useEffect, useState } from 'react'
import React from 'react'

async function updateBestQuote(bookName:string,bestQuoteString:string) {
    client
        .patch({ query: `*[ _type == 'book' && title == "${bookName}" ]` }) // Document ID to patch
        .set({ book_bestQuote: bestQuoteString })
        .commit()
        .then((updatedBike) => {
        })
        .catch((err) => {
            console.error('the update failed: ', err.message)
        })
}
async function getBestQuoteFromSanity(bookName:string,setBestQuote:React.Dispatch<React.SetStateAction<string>>,authorName:string){
    const beta = await client.fetch(`*[_type == "book" && title == "${bookName}" ]{book_bestQuote}`, { cache: 'no-store' });
    if(beta.length==0){
        getBestQuote(bookName,setBestQuote,authorName)
    }
    else{
        if(beta[0].book_bestQuote==null){
            getBestQuote(bookName,setBestQuote,authorName)
        }else{
            setBestQuote(beta[0].book_bestQuote);
        }
    }
}
async function getBestQuote(bookName:string,setBestQuote:React.Dispatch<React.SetStateAction<string>>,authorName:string) {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: `I will provide the name of the book and the name of the author on the basis of that you have to give the best quote written in that book`
            },
            {
                role: "assistant",
                content: "Of course! Please provide name of the book with the author details, and I'll be happy to provide a best quote related to that book"
            },
            {
                role: "user",
                content: `
                book name : The Man Who Knew Infinity: A Life of the Genius Ramanujan
                authorName: Robert Kanigel
                `
            },
            {
                role: "assistant",
                content: `"An equation means nothing to me unless it expresses a thought of God." - Srinivasa Ramanujan`
            },
            {
                role: "user",
                content: `
                book name : Panchatantra (Illustrated): Classic Tales
                authorName: Vishnu Sharma (original concept)
                `
            },
            {
                role: "assistant",
                content: `"The biggest guru-mantra is: Never share your secrets with anybody. It will destroy you." - Panchatantra (Illustrated): Classic Tales`
            },
            {
                role: 'user',
                content: `
                book name :  ${bookName}
                authorName: ${authorName}
                `
            },
            {
                role: "assistant",
                content: ""
            }

        ],
        stream: true,
    });
    let bestQuoteString=''
    for await (const chunk of completion) {
        if (chunk.choices[0].delta.content) {
            const data = chunk.choices[0].delta.content;
            bestQuoteString+=data;
            setBestQuote(prev => prev += data)
        }
    }
    updateBestQuote(bookName,bestQuoteString); 
}
export default function BestQuote({ bookName, authorName }: { bookName: string, authorName: string }) {
    const [bestQuote, setBestQuote] = useState('');
    
    useEffect(() => {
        if(bookName && authorName){
            getBestQuoteFromSanity(bookName,setBestQuote,authorName);
        }
    }, [bookName,authorName])
    return (
        <p className='text-blue-950 my-4'>{bestQuote}</p>
    )
}