import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import client from '@/sanity/client'

async function getBookDetails(bookTitle: string) {
    const bookDetails = await client.fetch(`*[_type == "book" && title=="${bookTitle}"]{
        title,
        book_image,
        book_tagline,
        book_timeToRead,
        book_author,
        book_ratingsReceived
    }`, { cache: 'no-store' });

    let book = JSON.parse(JSON.stringify(bookDetails[0]));

    let bookImageUrl: string | undefined = "";
    const imageData: any = book.book_image.asset._ref;
    const rawImage: any = await client.getDocument(imageData);
    bookImageUrl = rawImage.url;


    let authors = "";
    for (const a of book.book_author) {
        const rawdata: any = await client.getDocument(a._ref);
        authors = authors + " " + rawdata.authorName;
    }

    const ratingArray = book.book_ratingsReceived;
    const ratingNumber = ratingArray.length;
    let rating = 0;
    ratingArray.map((obj: any) => {
        rating = rating + obj.starRating;
    })
    rating = rating / ratingNumber;

    const bookData = {
        title: book.title,
        slogan: book.book_tagline,
        audioTime: `${book.book_timeToRead} min`,
        author: authors,
        rating: rating,
        imgUrl: bookImageUrl
    }
    return bookData;
}

async function getData(category: string) {
    try {
        const data = await client.fetch(`*[_type == "category" && name=="${category}"]`, { cache: 'no-store' });
        const newData = JSON.parse(JSON.stringify(data[0]));
        return newData;
    } catch (e) {
        console.log(e);
        throw new Error("Category does not exist");
    }
}

async function getAllData(categoryThing: string) {
    const alpha: any = await getData(categoryThing);
    const topics: Array<string> = alpha?.topics || [];

    const popular = ["THE HOBBIT", "THE HOBBIT", "THE HOBBIT", "THE HOBBIT", "THE HOBBIT"]

    const popularBooksArray = [];
    for (const p of popular) {
        const data = await getBookDetails(p);
        popularBooksArray.push(data);
    }

    const data = {
        category: categoryThing,
        slogan: "Mandela to Marie Curie, Steve Jobs to Toussaint L'Ouverture—learn the life lessons of giants.",
        topics: topics,
        popularBooks: popularBooksArray,
        newest: [
            {
                imgUrl: "https://images.blinkist.io/images/books/5f8962c26cee070007a86bae/1_1/470.jpg",
                title: "THE HOBBIT",
                author: "Don A. Moore",
                slogan: "How to Calibrate Your Decisions Wisely",
                audioTime: "19 min",
                rating: "4.1"
            },
            {
                imgUrl: "https://images.blinkist.io/images/books/5f8962c26cee070007a86bae/1_1/470.jpg",
                title: "THE HOBBIT",
                author: "Don A. Moore",
                slogan: "How to Calibrate Your Decisions Wisely",
                audioTime: "19 min",
                rating: "4.1"
            },
            {
                imgUrl: "https://images.blinkist.io/images/books/5f8962c26cee070007a86bae/1_1/470.jpg",
                title: "THE HOBBIT",
                author: "Don A. Moore",
                slogan: "How to Calibrate Your Decisions Wisely",
                audioTime: "19 min",
                rating: "4.1"
            },
            {
                imgUrl: "https://images.blinkist.io/images/books/5f8962c26cee070007a86bae/1_1/470.jpg",
                title: "THE HOBBIT",
                author: "Don A. Moore",
                slogan: "How to Calibrate Your Decisions Wisely",
                audioTime: "19 min",
                rating: "4.1"
            },
            {
                imgUrl: "https://images.blinkist.io/images/books/5f8962c26cee070007a86bae/1_1/470.jpg",
                title: "THE HOBBIT",
                author: "Don A. Moore",
                slogan: "How to Calibrate Your Decisions Wisely",
                audioTime: "19 min",
                rating: "4.1"
            },
            {
                imgUrl: "https://images.blinkist.io/images/books/5f8962c26cee070007a86bae/1_1/470.jpg",
                title: "THE HOBBIT",
                author: "Don A. Moore",
                slogan: "How to Calibrate Your Decisions Wisely",
                audioTime: "19 min",
                rating: "4.1"
            },
            {
                imgUrl: "https://images.blinkist.io/images/books/5f8962c26cee070007a86bae/1_1/470.jpg",
                title: "THE HOBBIT",
                author: "Don A. Moore",
                slogan: "How to Calibrate Your Decisions Wisely",
                audioTime: "19 min",
                rating: "4.1"
            },
            {
                imgUrl: "https://images.blinkist.io/images/books/5f8962c26cee070007a86bae/1_1/470.jpg",
                title: "THE HOBBIT",
                author: "Don A. Moore",
                slogan: "How to Calibrate Your Decisions Wisely",
                audioTime: "19 min",
                rating: "4.1"
            },
        ]
    }
    console.log(data);
    return data;
}
export default async function page({ params }: { params: { id: string } }) {
    const categoryThing: string = decodeURIComponent(params.id)
    const data = await getAllData(categoryThing);
    return (
        <div className='w-full'>
            <div className='md:p-[18px] p-8 md:py-16 lg:w-[60%] m-auto'>
                <div className='flex text-sm'>
                    <Link className='text-[#4e83fe] mr-2' href={"/categories"}>{"Categories >"}</Link>
                    <div>{data.category}</div>
                </div>
                <div className='text-3xl font-bold text-blue-950 my-5'>
                    {data.category}
                </div>
                <div className='text-[#3a4649] text-md'>
                    <p>{data.slogan}</p>
                </div>
                <div className='flex flex-col'>
                    <div className='text-xl font-bold text-blue-950 my-5'>
                        Topics
                    </div>
                    <div className='flex md:flex-wrap overflow-x-auto overflow-y-hidden p-1 cursor-pointer gap-6 whitespace-nowrap'>
                        {
                            data.topics && data.topics.map((topic: any, key: number) => {
                                return (
                                    <div className='my-2'>
                                        <span key={key} className='bg-[#f1f6f4] p-3 border-2 border-transparent hover:border-green-400 hover:rounded-md'>{topic}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='flex flex-col mt-10'>
                    <div className='text-xl font-bold text-blue-950 my-4'>
                        Popular
                    </div>
                    <div className='text-[#3a4649] text-md mb-4'>
                        <p>{`What's popular with the Blinkist community in ${data.category}`}</p>
                    </div>
                    <div className='flex md:flex-wrap overflow-x-auto overflow-y-hidden gap-6 whitespace-nowrap'>
                        {
                            data.popularBooks && data.popularBooks.map((book, key) => {
                                return (
                                    <Link href={`/book/${book.title}`} className='my-2 flex flex-col w-[200px]'>
                                        <Image src={book.imgUrl || ''} alt={book.title} width={150} height={100} />
                                        <div className='font-bold text-sm text-blue-950 my-2'>{book.title}</div>
                                        <div className='text-[#515b5e] font-bold text-sm mb-2 whitespace-break-spaces'>{book.author}</div>
                                        <div className='text-[#515b5e] text-sm mb-2 w-full whitespace-break-spaces'><p>{book.slogan}</p></div>
                                        <div className='flex gap-5 text-sm text-[#515b5e]'>
                                            <div>{book.audioTime}</div>
                                            <div>{book.rating}</div>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='flex flex-col mt-10'>
                    <div className='text-xl font-bold text-blue-950 my-4'>
                        Newest
                    </div>
                    <div className='text-[#3a4649] text-md mb-4'>
                        <p>Nothing but the freshest additions to the catalogue</p>
                    </div>
                    <div className='flex md:flex-wrap overflow-x-auto overflow-y-hidden gap-6 whitespace-nowrap'>
                        {
                            data.newest && data.newest.map((book, key) => {
                                return (
                                    <Link href={`/book/${book.title}`} className='my-2 flex flex-col w-[200px]'>
                                        <Image src={book.imgUrl} alt={book.title} width={150} height={100} />
                                        <div className='font-bold text-sm text-blue-950 my-2'>{book.title}</div>
                                        <div className='text-[#515b5e] font-bold text-sm mb-2'>{book.author}</div>
                                        <div className='text-[#515b5e] text-sm mb-2 w-full whitespace-break-spaces'><p>{book.slogan}</p></div>
                                        <div className='flex gap-5 text-sm text-[#515b5e]'>
                                            <div>{book.audioTime}</div>
                                            <div>{book.rating}</div>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}