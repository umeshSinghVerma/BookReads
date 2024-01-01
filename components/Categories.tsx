'use client'
import openai from "@/openAi";
import client from "@/sanity/client";
import { Box, Skeleton } from "@mui/material";
import Link from "next/link";
import React from 'react'
import { useEffect, useState } from 'react'
async function main() {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: `

            Book name : The Man Who Knew Infinity: A Life of the Genius Ramanujan
            Authors name :  Robert Kanigel

            You have to complete the object given below 

            {
                aboutAuthors = [] // this is the array of objects which contains about the author for each author of the book,
                topics = [] // this array will contains 4 or 5 topics related to that book
                bestQuote = // this will contain the best quote of the book
                categories = [] this array will contain the suitable categories from the categories given below
                "Biography & Memoir", "Career & Success", "Communication Skills", "Corporate Culture", "Creativity", "Economics", "Education", "Entrepreneurship", "Health & Nutrition", "History", "Management & Leadership", "Marketing & Sales", "Mindfulness & Happiness", "Money & Investments", "Motivation & Inspiration", "Nature & the Environment", "Parenting", "Personal Development", "Philosophy", "Politics", "Productivity", "Psychology", "Religion & Spirituality", "Science", "Sex & Relationships", "Society & Culture", "Technology & the Future"

                summary: [] this array will contain the summary in the format like given below 
                Generate a detailed summary of the book'. Please structure the summary in the following format: \n\n[\n  {\n    \"key_idea\": \"The Return to Hogwarts\",\n    \"summary\": \"As Harry returns to his sixth year at Hogwarts School of Witchcraft and Wizardry, the atmosphere is tense. The wizarding world is facing dark times, with the return of Lord Voldemort's Death Eaters. Dumbledore seeks Harry's help to understand Voldemort's past and weaknesses to aid in his eventual defeat.\"\n  },\n  {\n    \"key_idea\": \"Voldemort's Past Revealed\",\n    \"summary\": \"Harry delves into Voldemort's past using memories collected by Dumbledore. He learns about Voldemort's family history, his orphaned childhood, and the creation of Horcruxes - objects in which a Dark wizard or witch hides a part of their soul to achieve immortality.\"\n  },\n  {\n    \"key_idea\": \"Romance and Relationships\",\n    \"summary\": \"Amidst the dark events, romance blossoms at Hogwarts. Harry harbors feelings for Ginny Weasley, Ron's sister, while Ron and Hermione's relationship evolves. Love and relationships intertwine with the tension and danger lurking within the wizarding world.\"\n  },\n  {\n    \"key_idea\": \"The Darkening Threat\",\n    \"summary\": \"The threat of Voldemort and his Death Eaters looms larger, leading to tragic events. Hogwarts is no longer a safe haven. The Death Eaters infiltrate the Ministry of Magic, causing chaos and panic within the wizarding community.\"\n  },\n  {\n    \"key_idea\": \"The Quest for Horcruxes\",\n    \"summary\": \"Dumbledore and Harry embark on a quest to uncover and destroy Voldemort's Horcruxes, items that hold parts of his soul. Their mission leads to the revelation of a crucial Horcrux, but ends with an unexpected turn of events at the hands of Severus Snape.\"\n  },\n  {\n    \"key_idea\": \"Loss and Resolution\",\n    \"summary\": \"Tragedy strikes as Dumbledore falls at the hands of Snape. The loss deeply affects Harry, but he resolves to carry on Dumbledore's mission: to stop Voldemort. The wizarding world faces an uncertain future, but Harry is now more determined than ever to confront the dark wizard.\"\n  }\n]

                give at least 8 key ideas and within each key idea there must be the summary of at least 4 paragraphs
            }

            `
            },
            {
                role: "assistant",
                content: ""
            }
        ],
        stream: true,
    });

    for await (const chunk of completion) {
        console.log(chunk.choices[0].delta.content);
    }
}
async function getDataFromSanity(bookName: string, authorName: string, setData: React.Dispatch<React.SetStateAction<string[]>>) {
    const beta = await client.fetch(`*[_type == "book" && title == "${bookName}" ]{
        categories
    }`, { cache: 'no-store' });
    if (beta.length == 0) {
        getCategoryFromGPT(bookName, authorName, setData);
    }
    else {
        if (beta[0].categories == null) {
            getCategoryFromGPT(bookName, authorName, setData);
        } else {
            setData(beta[0].categories);
        }
    }
}
async function updateCategories(category: Array<string>, bookName: string) {
    client
        .patch({ query: `*[ _type == 'book' && title == "${bookName}" ]` }) // Document ID to patch
        // .set({ trial1: "newhelloupdated" }) // Shallow merge
        .set({ categories: category })
        // .insert('after', 'categories[-1]', category) // whenever there is the single thing to add into the array ;  here arraytrial is the name of the array 
        .commit() // Perform the patch and return a promise
        .then((updatedBike) => {
        })
        .catch((err) => {
            console.error('the update failed: ', err.message)
        })
}


async function getCategoryFromGPT(bookName: string, authorName: string, setData: React.Dispatch<React.SetStateAction<string[]>>) {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: `These are the list of categories from which you have to select at most 4 categories which are most suitable to the book only from the categories listed . "Biography & Memoir", "Career & Success", "Communication Skills", "Corporate Culture", "Creativity", "Economics", "Education", "Entrepreneurship", "Health & Nutrition", "History", "Management & Leadership", "Marketing & Sales", "Mindfulness & Happiness", "Money & Investments", "Motivation & Inspiration", "Nature & the Environment", "Parenting", "Personal Development", "Philosophy", "Politics", "Productivity", "Psychology", "Religion & Spirituality", "Science", "Sex & Relationships", "Society & Culture", "Technology & the Future"
                `
            },
            {
                role: "assistant",
                content: "Sure provide the name and the author of the book I will give you the categories seperated by comma"
            },
            {
                role: 'user',
                content: `
                Book name : The Man Who Knew Infinity: A Life of the Genius Ramanujan
                Authors name :  Robert Kanigel
                `
            },
            {
                role: "assistant",
                content: "Biography & Memoir,History,Science,Society & Culture"
            },
            {
                role: 'user',
                content: `
                Book name : The Way of Integrity
                Authors name :  Martha Beck
                `
            },
            {
                role: "assistant",
                content: "Personal Development,Self-Help,Psychology,Philosophy"
            },
            {
                role: 'user',
                content: `
                Book name : Perfectly Confident
                Authors name :  Don A. Moore
                `
            },
            {
                role: "assistant",
                content: "Psychology,Personal Development,Communication Skills,Motivation & Inspiration"
            },
            {
                role: 'user',
                content: `
                Book name: Perfectly Confident
                Authors name: Don A. Moore
                `
            },
            {
                role: "assistant",
                content: "Psychology, Personal Development, Communication Skills, Motivation & Inspiration"
            },
            {
                role: 'user',
                content: `
                Book name : ${bookName}
                Authors name :  ${authorName}
                `
            },
            {
                role: "assistant",
                content: ""
            }
        ],
        stream: true,
    });
    let stringchunk = '';
    let cate: Array<string> = [];
    for await (const chunk of completion) {
        if (chunk.choices[0].delta.content && chunk.choices[0].delta.content != ' ') {
            stringchunk += chunk.choices[0].delta.content;
            if (stringchunk[stringchunk.length - 1] == ',') {
                const formattedStringChunk = stringchunk.replace(',', '').trim();
                if (!cate.includes(formattedStringChunk) && formattedStringChunk != "") {
                    cate.push(formattedStringChunk);
                }
                stringchunk = '';
            }
        }
    }
    if (stringchunk != '') {
        const formattedStringChunk = stringchunk.replace(',', '').trim();
        if (!cate.includes(formattedStringChunk) && formattedStringChunk != "") {
            cate.push(formattedStringChunk);
        }
    }
    updateCategories(cate, bookName);
    setData(cate)
}
export default function Categories({ bookName, authorName, type }: { bookName: string, authorName: string, type: string }) {
    const categories = [
        "Biography & Memoir",
        "Career & Success",
        "Communication Skills",
        "Corporate Culture",
        "Creativity",
        "Economics",
        "Education",
        "Entrepreneurship",
        "Health & Nutrition",
        "History",
        "Management & Leadership",
        "Marketing & Sales",
        "Mindfulness & Happiness",
        "Money & Investments",
        "Motivation & Inspiration",
        "Nature & the Environment",
        "Parenting",
        "Personal Development",
        "Philosophy",
        "Politics",
        "Productivity",
        "Psychology",
        "Religion & Spirituality",
        "Science",
        "Sex & Relationships",
        "Society & Culture",
        "Technology & the Future"
    ];
    const [data, setData] = useState<string[]>([]);

    useEffect(() => {
        if (bookName && authorName) {
            getDataFromSanity(bookName, authorName, setData);
        }
    }, [bookName, authorName])
    return (
        type === 'list' ? (
            <div className='flex flex-wrap p-1 cursor-pointer gap-6 whitespace-nowrap my-8'>
                {
                    data.length > 0 ? (data.map((topic: string, key: number) => {
                        return (
                            <Link href={categories.includes(topic) ? `/categories/${topic}` : "/categories"} key={key} className='text-center min-w-min md:w-[30%] flex-grow bg-[#f1f6f4] p-3 border-2 border-transparent hover:border-green-400 hover:rounded-md'>
                                <p className=''>{topic}</p>
                            </Link>
                        )
                    })) : (
                        <div className="flex flex-wrap gap-6">
                            <Box sx={{ width: 150 }}>
                                <Skeleton width={150} height={80} />
                            </Box>
                            <Box sx={{ width: 150 }}>
                                <Skeleton width={150} height={80} />
                            </Box>
                            <Box sx={{ width: 150 }}>
                                <Skeleton width={150} height={80} />
                            </Box>
                            <Box sx={{ width: 150 }}>
                                <Skeleton width={150} height={80} />
                            </Box>
                        </div>
                    )
                }
            </div>
        ) : (
            data[0] && <Link href={categories.includes(data[0]) ? `/categories/${data[0]}` : "/categories"} className='text-blue-600 w-min'>{`${data[0]}`}</Link>
        )
    );
}
