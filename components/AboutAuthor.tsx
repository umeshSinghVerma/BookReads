import client from "@/sanity/client";
import { AnyArn } from "aws-sdk/clients/groundstation";
import axios from "axios";
import React from 'react'
async function updateAboutAuthor(bookId: string, AuthorDetails: Array<{id:number, name: string, url:string, desc: string }>) {
    if (AuthorDetails.length > 0) {
        client
            .patch({ query: `*[ _type == 'book' && slug == "${bookId}" ]` })
            .set({ book_AllAuthors: AuthorDetails })
            .commit({ autoGenerateArrayKeys: true })
            .then((updatedBike: any) => {
                console.log(updatedBike)
            })
            .catch((err: any) => {
                console.error('Oh no, the update failed: ', err.message)
            })
    }
}
async function fetchAuthorDetails(bookId: string, AuthorDetails: Array<{ id: number, name: string, url: string,desc:string }>) {
    const AuthorDescription: Array<{id:number, name: string,url:string, desc: string }> = []
    for (let i = 0; i < AuthorDetails.length; i++) {
        const body = JSON.stringify({
            queryURL: `https://www.goodreads.com${AuthorDetails[i].url}`,
        })
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/authorInfo`, body);
        const authorObject = response.data;
        if (authorObject && authorObject?.desc && authorObject?.desc.trim() != "") {
            AuthorDescription.push({id:AuthorDetails[i].id, name: authorObject.name, url:AuthorDetails[i].url, desc: authorObject.desc });
        }
    }
    updateAboutAuthor(bookId, AuthorDescription);
    return AuthorDescription;
}
async function getAboutTheAuthorFromSanity
    (
        bookId: string,
        AuthorDetails: Array<{ id: number, name: string, url: string,desc:string }>
    ) {

    const beta = await client.fetch(`*[_type == 'book' && slug == '${bookId}' ]{book_AllAuthors}`, { cache: 'no-store' });

    if (beta.length == 0) {
        const FetcedAuthorDesc = await fetchAuthorDetails(bookId, AuthorDetails);
        return FetcedAuthorDesc;
    }
    else {
        return AuthorDetails;
    }
}
export default async function AboutAuthor({ bookId, AuthorDetails }: { bookId: string, AuthorDetails: any }) {
    const aboutAuthor = await getAboutTheAuthorFromSanity(bookId, AuthorDetails);
    return (
        <>
            { aboutAuthor && aboutAuthor?.length > 0 && <div>
                <span className='md:text-xl font-bold text-blue-950'>About the Author</span>
                {
                    aboutAuthor && aboutAuthor.map((author: { id: number, name: string, url: string,desc:string },key:number) => {
                        return <div key={key}>
                            <h1 className="md:text-lg font-bold text-blue-950 mt-5 mb-2">{author.name}</h1>
                            <p dangerouslySetInnerHTML={{ __html: author?.desc }}></p>
                        </div>
                    })
                }
            </div>}
        </>
    )
}

