
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
import authorDetails from '@/sanity/schemas/author'

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
    const doc = {
        _type: 'book',
        slug: id,
        title: data.title,
        imgUrl: data.imgUrl,
        book_tagline: data.slogan,
        about: data.description,
        book_rating: data.rating,
        book_topic: data.topics,
    }
    client.create(doc).then((res) => {
        console.log(`Book is created, document ID is ${res._id}`)
    })
}


async function getdata(id: string) {
    const beta = await client.fetch(`*[_type == "book" && slug == "${id}" ]`, { cache: 'no-store' });
    if (beta.length == 0) {
        const scrapedData = await getScrapedData(id);
        const data: {
            category: Array<string>,
            bestQuote: string,
            summary: any,
            RatingReview: string,
            description: string,
            topics: Array<string>,
            AuthorDetails: Array<{ id: number, name: string, url: string,desc:string }>,
            related: any,
            title: string,
            imgUrl: string,
            slogan: string,
            rating: string
        } = {
            category: [],
            bestQuote: scrapedData.quotesURL || '',
            summary: [],
            RatingReview: scrapedData.reviewsCount || '',
            description: scrapedData.desc || '',
            topics: scrapedData.genres || [],
            AuthorDetails: scrapedData.author || [],
            related: scrapedData.related || [],
            title: scrapedData.title || '',
            imgUrl: scrapedData.cover || '',
            slogan: '',
            rating: scrapedData.rating || ''
        }
        uploadData(data, id);
        return data;
    } else {
        const book = await beta[0];
        const alpha = {
            description: book?.about || "",
            time: book?.book_timeToRead || "",
            topics: book?.book_topic || [],
            category: book?.categories || [],
            bestQuote: book?.book_bestQuote || "",
            summary: book?.wholeSummary || [],
            AuthorDetails: book?.book_AllAuthors || [],
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
    let scrapedData: any = [];
    try {

        const body = JSON.stringify({
            queryURL: `https://www.goodreads.com/book/show/${id}`,
        })
        const searchData = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookScraper`, body);
        scrapedData = searchData.data;
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
        bookStatus = await getStatus(alpha?.user, data.title, "", data.imgUrl);
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
                            <Favourite bookTitle={data.title} bookImg={data.imgUrl} bookAuthor={""} initialStatus={bookStatus} />
                        </div>
                        <div className='font-bold text-blue-950 mb-5 whitespace-break-spaces text-sm'>
                            By.{data?.AuthorDetails[0]?.name}
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
                                    <Topics bookId={bookTitle} topics={data.topics} />
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
                <div id='summary'>
                    <Summary bookName={data.title} authorName={data?.AuthorDetails[0]?.name} />
                </div>
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
                    <div id='bestquotes' className='my-10'>
                        <BestQuote bookName={data.title} authorName={""} />
                    </div>
                    {data.AuthorDetails && <div id='aboutauthor' className='my-10'>
                        <AboutAuthor bookId={bookTitle} AuthorDetails={data.AuthorDetails} />
                    </div>}
                    <div id='bestquotes' className='my-10'>
                        <span className='md:text-xl font-bold text-blue-950'>Categories with</span>
                        <span className='md:text-xl italic text-blue-950 ml-2'>{data.title}</span>
                        <Categories bookName={data.title} authorName={""} type={'list'} />
                    </div>
                </div>
            </div>
        </div>
    )
}
