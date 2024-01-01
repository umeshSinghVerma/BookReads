'use client'
import openai from "@/openAi";
import client from "@/sanity/client";
import authorDetails from "@/sanity/schemas/author";
import { useEffect, useState } from 'react'
import React from 'react'
async function updateAboutAuthor(bookName: string, AuthorDetails: Array<{ authorName: string, aboutAuthor: string }>) {
    client
        .patch({ query: `*[ _type == 'book' && title == "${bookName}" ]` })
        .set({ book_AllAuthors: AuthorDetails })
        .commit({ autoGenerateArrayKeys: true })
        .then((updatedBike: any) => {
            console.log('fasdfsadfasfasdfasfdf a sdafasdfasdfada:')
            console.log(updatedBike)
        })
        .catch((err: any) => {
            console.error('Oh no, the update failed: ', err.message)
        })
}
async function getAboutTheAuthorFromSanity(bookName: string, setAboutAuthor: React.Dispatch<React.SetStateAction<{ authorName: string; aboutAuthor: string; }[]>>, AuthorDetails: Array<{ authorName: string, aboutAuthor: string }>) {
    const beta = await client.fetch(`*[_type == "book" && title == "${bookName}" ]{book_AllAuthors}`, { cache: 'no-store' });
    if (beta.length == 0) {
        setAboutAuthor(AuthorDetails);
    }
    else {
        if (beta[0].book_aboutAuthor == null) {
            updateAboutAuthor(bookName, AuthorDetails);
        }
        setAboutAuthor(beta[0]?.book_AllAuthors);

    }
}
export default function AboutAuthor({ bookName, authorName, AuthorDetails }: { bookName: string, authorName: string, AuthorDetails: Array<{ authorName: string, aboutAuthor: string }> }) {
    const [aboutAuthor, setAboutAuthor] = useState<Array<{ authorName: string, aboutAuthor: string }>>([]);

    useEffect(() => {
        if (bookName && authorName) {
            getAboutTheAuthorFromSanity(bookName, setAboutAuthor, AuthorDetails);
        }
    }, [bookName, authorName])
    console.log('ye hai', aboutAuthor)
    return (
        <div>
            <span className='md:text-xl font-bold text-blue-950'>About the Author</span>
            {
                aboutAuthor && aboutAuthor.map((author: { authorName: string, aboutAuthor: string }, key: number) => {
                    return <div key={key}>
                        <h1 className="md:text-lg font-bold text-blue-950 mt-5 mb-2">{author.authorName}</h1>
                        <p>{author.aboutAuthor}</p>
                    </div>
                })
            }
        </div>
    )
}

