
import client from '@/sanity/client'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import TableComponents from '@/components/TableComponents'
import Categories from '@/components/Categories'
import AboutAuthor from '@/components/AboutAuthor'
import Summary from '@/components/Summary'
import BestQuote from '@/components/BestQuote'
import Topics from '@/components/Topics'
import axios from 'axios'
import Favourite from '@/components/Favourite'
import { getServerSession } from "next-auth"

async function getStatus(user: any, bookTitle: string, bookAuthor: string, bookImg: string) {
    const previousData = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user?email=${user?.email}`, {
        headers: {
            Authorization: `Bearer ${user?.name}`,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000,https://wittpad-alpha.vercel.app',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
        }
    });
    const oldData = { ...previousData.data.data };
    const oldSavedBooks = oldData?.savedBooks;
    console.log(oldSavedBooks);
    if (oldData?.savedBooks) {
        const obj = { author: bookAuthor, title: bookTitle, img: bookImg };
        let flag = 0;
        for (let i = 0; i < oldSavedBooks.length; i++) {
            let element = oldSavedBooks[i];
            console.log('elements ', element);
            if (element.author === obj.author && element.title === obj.title && element.img === obj.img) {
                flag = 1;
                return true
            }
        };
    } else {
        return false;
    }
}
async function uploadData(data: any, id: string) {
    let topicsArray: Array<string> = [];
    if (data.topics) {
        topicsArray = data.topics.split(',')
    }
    const doc = {
        _type: 'book',
        slug: id,
        title: data.title,
        imgUrl: data.imgUrl,
        book_author: data.author,
        book_tagline: data.slogan,
        about: data.description,
        book_rating: data.rating,
        book_topic: topicsArray,
        book_AllAuthors: data.AuthorDetails
    }
    client.create(doc).then((res) => {
        console.log(`Book is created, document ID is ${res._id}`)
    })
}


async function getdata(id: string) {
    const beta = await client.fetch(`*[_type == "book" && slug == "${id}" ]`, { cache: 'no-store' });
    if (beta.length == 0) {
        const scrapedData = await getScrapedData(id);
        const data = {
            time: "",
            category: [],
            bestQuote: "",
            summary: [],
            RatingReview: ``,
            aboutAuthor: '',
            ...scrapedData
        }
        let topicsArray: Array<string> = [];
        if (data.topics) {
            topicsArray = data.topics.split(',')
        }
        return data;

    }
    const book = await beta[0];

    if (book.title == null) {
        console.log("I am coming here");
        const scrapedData = await getScrapedData(id);
        let data = {
            time: "",
            category: [],
            bestQuote: "",
            summary: [],
            RatingReview: ``,
            aboutAuthor: '',
            ...scrapedData
        }
        let topicsArray: Array<string> = [];
        if (data.topics) {
            topicsArray = data.topics.split(',')
        }
        console.log("this is data", data);
        return data;

    } else {

        // let authors = "";
        // let aboutAuthorArray: Array<string> = [];
        // for (const a of book.book_author) {
        //     const rawdata: any = await client.fetch(`*[ _id == "${a._ref}" ]`, { cache: 'no-store' });
        //     authors = authors + " " + rawdata[0].authorName;
        //     console.log("Rawdata: ", { authors, aboutAuthorArray, rawdata });
        //     const authortext = JSON.stringify(rawdata[0].aboutAuthor);
        //     aboutAuthorArray.push(authortext);
        // }


        // let bookCategory: Array<string> | undefined = [];
        // for (const a of book.categories) {
        //     const rawCategory: any = await client.getDocument(a._ref);
        //     bookCategory?.push(rawCategory.name);
        // }

        // let bookImageUrl: string | undefined = "";
        // const imageData: any = book.book_image.asset._ref;
        // const rawImage: any = await client.getDocument(imageData);
        // bookImageUrl = rawImage.url;

        // const ratingArray = book.book_ratingsReceived;
        // const ratingNumber = ratingArray.length;
        // let rating = 0;
        // ratingArray.map((obj: any) => {
        //     rating = rating + obj.starRating;
        // })
        // rating = rating / ratingNumber;

        const alpha = {
            description: book?.about || "",
            time: book?.book_timeToRead || "",
            topics: book?.book_topic || [],
            category: book?.categories || [],
            bestQuote: book?.book_bestQuote || "",
            summary: book?.wholeSummary || [],
            AuthorDetails: [],


            aboutAuthor: book?.book_aboutAuthor || "",

            title: book?.title || "",
            author: book?.book_author || "",
            imgUrl: book?.imgUrl || "",
            slogan: book?.book_tagline || "",
            rating: book?.book_rating || "",
            RatingReview: `${5} Ratings`
        }


        return alpha;
    }

}
async function getScrapedData(id: string) {
    const url = `https://biblioreads.eu.org/book/show/${id}`;
    let scrapedData = [];
    try {
        const searchData = await axios.get(`https://puppeteer-render-l46i.onrender.com/getBook?bookUrl=${url}`);
        scrapedData = searchData.data;
        uploadData(scrapedData, id);
        return scrapedData;
    }
    catch (e) {
        console.log(e)
    }
    return scrapedData;
}

export default async function Page({ params }: { params: { id: string } }) {
    const bookTitle: string = decodeURIComponent(params.id)
    const data = await getdata(bookTitle);

    const alpha = await getServerSession();
    let bookStatus = undefined;
    if (alpha) {
        bookStatus = await getStatus(alpha?.user, data.title, data.author, data.imgUrl);
    }

    return (
        <div>
            <div className='lg:w-[60%] m-auto md:p-[18px] pt-0 px-[18px]'>
                {/* <div className='gap-1 text-sm hidden md:flex my-3 text-blue-600'>
                    <Link className='text-blue-600' href={'/categories'}>{`Categories`}</Link>
                    <span>{`>`}</span>
                    <Categories bookName={data.title} authorName={data.author} type={'breadcrumb'} />
                    <span>{`>`}</span>
                    <p className='text-black'>{data.title}</p>
                </div> */}
                <div className='flex flex-col-reverse md:flex-row md:gap-10 justify-between'>
                    <div>
                        <p className='text-[#6d787e] mt-12 mb-4 md:my-4 font-semibold'>Better than a summary</p>
                        <div className='flex gap-5'>
                            <div className='text-3xl font-bold text-blue-950 mb-5 '>
                                {data.title}
                            </div>
                            <Favourite bookTitle={data.title} bookImg={data.imgUrl} bookAuthor={data.author} initialStatus={bookStatus} />
                        </div>
                        <div className='font-bold text-blue-950 mb-5 whitespace-break-spaces text-sm'>
                            {data.author}
                        </div>
                        <div className='my-4'>
                            {data.slogan}
                        </div>
                        <div className='flex gap-4 flex-wrap'>
                            <div className='flex items-center text-sm my-3 gap-2'>
                                <img src="/star.svg" alt="" height={30} width={30} />
                                <span className='mb-2'>{data.rating}</span>
                            </div>
                        </div>
                        <div className='my-4'>
                            <Link href={"/login"} className='py-3 px-10 font-semibold text-blue-950 md:inline hidden border-0 bg-green-400 rounded'>Log in to Listen Audio</Link>
                        </div>
                        <div className='flex flex-col-reverse md:flex-col my-4'>
                            <div>
                                <div className='flex flex-wrap  p-1 cursor-pointer gap-6 whitespace-nowrap md:mb-8'>
                                    <Topics bookName={data.title} authorName={data.author} topics={data.topics} />
                                </div>
                            </div>
                            <TableComponents summaryLength={data.summary.length} title={data.title} />
                        </div>
                    </div>
                    <div className='md:mt-4 flex items-center justify-center bg-[#ebd6c6]  -mx-[18px] p-10 h-min'>
                        <Image src={data.imgUrl || ""} width={200} height={400} alt={data.title} />
                    </div>
                </div>
                <div className='my-4'>
                    <Link href={"/login"} className='py-3 px-10 font-semibold text-blue-950 block text-center md:hidden border-0 bg-green-400 rounded'>Log in to Listen Audio</Link>
                </div>
                {/* <div id='summary' className='flex flex-col gap-3 mb-8'>
                    <p className='md:text-xl font-bold text-blue-950'>Summary</p>
                    <Summary bookName={data.title} authorName={data.author} />
                </div> */}
                <div>
                    <div className='text-center md:text-3xl font-bold text-blue-950 mb-5'>
                        More Knowledge in less time
                    </div>
                    <div className='flex flex-wrap justify-between'>
                        <div className='flex md:flex-col gap-5 md:gap-0 items-center justify-center md:max-w-[200px]'>
                            <img src="/keyIdeas.svg" alt="" width={80} height={50} />
                            <div>
                                <div className=' md:text-xl font-bold text-blue-950 md:mb-5'>
                                    Read or listen
                                </div>
                                <div className='text-sm md:text-base text-blue-950 mb-5'>
                                    Get the key ideas from nonfiction bestsellers in minutes, not hours.
                                </div>
                            </div>
                        </div>
                        <div className='flex md:flex-col gap-5 md:gap-0 items-center justify-center md:max-w-[200px]'>
                            <img src="/bulb.svg" alt="" width={80} height={50} />
                            <div>
                                <div className=' md:text-xl font-bold text-blue-950 md:mb-5'>
                                    Find your next read
                                </div>
                                <div className='text-sm md:text-base text-blue-950 mb-5'>
                                    Get book lists curated by experts and personalized recommendations.
                                </div>
                            </div>
                        </div>
                        <div className='flex md:flex-col gap-5 md:gap-0 items-center justify-center md:max-w-[200px]'>
                            <img src="/shortcast.svg" alt="" width={80} height={50} />
                            <div>
                                <div className=' md:text-xl font-bold text-blue-950 md:mb-5'>
                                    Shortcasts
                                </div>
                                <div className='text-sm md:text-base text-blue-950 mb-5'>
                                    {`We've teamed up with podcast creators to bring you key insights from podcasts.`}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id='aboutbook' className='my-10'>
                        <span className='md:text-xl font-bold text-blue-950'>What is</span>
                        <span className='md:text-xl italic text-blue-950 mx-1'>{data.title}</span>
                        <span className='md:text-xl font-bold text-blue-950'>about ?</span>
                        <p className='text-blue-950 my-4'>{data.description}</p>
                    </div>
                    {/* <div id='bestquotes' className='my-10'>
                        <span className='md:text-xl font-bold text-blue-950'>Best quote from</span>
                        <span className='md:text-xl italic text-blue-950 mx-1'>{data.title}</span>
                        <BestQuote bookName={data.title} authorName={data.author} />
                    </div> */}
                    {data.AuthorDetails && <div id='aboutauthor' className='my-10'>
                        <AboutAuthor authorName={data.author} bookName={data.title} AuthorDetails={data.AuthorDetails} />
                    </div>}
                    {/* <div id='bestquotes' className='my-10'>
                        <span className='md:text-xl font-bold text-blue-950'>Categories with</span>
                        <span className='md:text-xl italic text-blue-950 ml-2'>{data.title}</span>
                        <Categories bookName={data.title} authorName={data.author} type={'list'} />
                    </div> */}
                </div>
            </div>
        </div>
    )
}
