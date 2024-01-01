'use client'
import client from "@/sanity/client";
import Link from "next/link";
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import React from 'react'
import openai from "@/openAi";

async function getTopicsFromSanity(bookName: string, authorName: string, topics: Array<string>, setData: React.Dispatch<React.SetStateAction<string[]>>) {
    const beta = await client.fetch(`*[_type == "book" && title == "${bookName}" ]{
        book_topic
    }`, { cache: 'no-store' });
    let TrimmedTopics: Array<string> = [];
    console.log("this is topics ", topics);
    if (topics && topics.length > 0) {
        TrimmedTopics = topics?.map((topic: string) => {
            return topic.trim();
        })
    }
    if (beta.length == 0) {
        // getTopicsFromGPT(bookName, authorName, setData);
        setData(TrimmedTopics);
        updateTopics(TrimmedTopics, bookName);
    }
    else {
        if (beta[0].book_topic == null) {
            // getTopicsFromGPT(bookName, authorName, setData);
            setData(TrimmedTopics);
            updateTopics(TrimmedTopics, bookName);
        } else {
            setData(beta[0].book_topic);
        }
    }
}
async function updateTopics(topics: Array<string>, bookName: string) {
    client
        .patch({ query: `*[ _type == 'book' && title == "${bookName}" ]` }) // Document ID to patch
        // .set({ trial1: "newhelloupdated" }) // Shallow merge
        .set({ book_topic: topics })
        // .insert('after', 'book_topic[-1]', topics) 
        .commit()
        .then((updatedBike) => {
        })
        .catch((err) => {
            console.error('the update failed: ', err.message)
        })
}

export default function Topics({ bookName, authorName, topics }: { bookName: string, authorName: string, topics: Array<string> }) {
    const [data, setData] = useState<string[]>([]);
    useEffect(() => {
        if (bookName && authorName) {
            getTopicsFromSanity(bookName, authorName, topics, setData);
        }
    }, [bookName, authorName]);
    return (
        <div>
            <div>
                {data.length > 0 && <div className='font-bold text-sm text-blue-950 my-5'>
                    Topics
                </div>}
            </div>
            <div className='flex flex-wrap  p-1 cursor-pointer gap-6 whitespace-nowrap'>
                {
                    data.length > 0 && (data.map((topic: string, key: number) => {
                        if (topic != "") {
                            return (
                                <Link href={'#'} key={key} className='text-center min-w-min md:w-[30%] flex-grow bg-[#f1f6f4] p-3 border-2 border-transparent hover:border-green-400 hover:rounded-md'>
                                    <p className=''>{topic}</p>
                                </Link>
                            )
                        }
                        else {
                            return null;
                        }
                    }))
                }
            </div>
        </div>
    )
}
