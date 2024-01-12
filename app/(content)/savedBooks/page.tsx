import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
async function getSavedBook(user: any) {
    const previousData = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getBooksMongo`,
        { email: user.email },
        {
            headers: {
                Authorization: `Bearer ${user?.name}`,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:3000,https://allbooks.vercel.app',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
            }
        });
    const oldData = { ...previousData.data.user };
    const oldSavedBooks = oldData?.books;
    return oldSavedBooks;
}
export default async function page() {
    const session = await getServerSession();
    if (!session) {
        redirect('/');
    }

    const savedBooks = await getSavedBook(session?.user);
    console.log('savedBooks',savedBooks);
    return (
        <div>
            <div className='lg:w-[60%] m-auto md:p-[18px] pt-0 px-[18px]'>
                <div className='text-3xl font-bold text-blue-950 mb-5 '>
                    Saved Books
                </div>
                <div className='flex flex-col gap-5'>
                    {
                        savedBooks && savedBooks.length > 0 && savedBooks.map((book: any, key: any) => {
                            return (
                                <Link href={book?.bookURL} className='hover:text-blue-600 hover:border'>
                                    <div className='text-sm flex my-3 w-full h-min bg-white p-3 gap-5 justify-center items-center'>
                                        <div>
                                            <img src={book.cover} alt="" className='max-h-[120px]' />
                                        </div>
                                        <div className='flex flex-col w-full'>
                                            <p key={key} className='whitespace-break-spaces'>{book?.title}</p>
                                            <p key={key} className='whitespace-break-spaces'>{book?.author}</p>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div>

        </div>
    )
}
