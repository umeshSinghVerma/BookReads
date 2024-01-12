'use client'
import React, { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { useSession } from 'next-auth/react'
import axios from 'axios';
import { usePathname } from 'next/navigation';
export default function Favourite({ bookId, bookImg, bookAuthor, bookTitle, initialStatus }: { bookId: string, bookImg: string, bookAuthor: string, bookTitle: string, initialStatus: boolean | undefined }) {
    const { data: session } = useSession()
    const pathname = usePathname();
    const [favourite, setFavoutite] = useState<boolean | undefined>(initialStatus);
    return (
        <>
            {session && <div>
                <IconButton onClick={() => {
                    if (favourite) {
                        axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/deleteBookMongo`,
                            {
                                email: session.user?.email,
                                bookTitle: bookTitle
                            }, {
                            headers: {
                                Authorization: `Bearer ${session.user?.name}`,
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': 'http://localhost:3000,https://allbooks.vercel.app',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
                            }
                        })
                        setFavoutite(false);
                    } else {
                        axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/addBooksMongo`, {
                            email: session.user?.email,
                            addBook: { author: bookAuthor, title: bookTitle, cover: bookImg, bookURL: `/book/show/${bookId}` }
                        }, {
                            headers: {
                                Authorization: `Bearer ${session.user?.name}`,
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': 'http://localhost:3000,https://allbooks.vercel.app',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
                            }
                        })
                        setFavoutite(true);
                    }
                }}>
                    {favourite ? <FavoriteIcon /> : <FavoriteBorder />}
                </IconButton>
            </div >}
        </>
    )
}
