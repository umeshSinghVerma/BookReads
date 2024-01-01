'use client'
import React, { useEffect, useState } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { useSession } from 'next-auth/react'
import axios from 'axios';
import { usePathname } from 'next/navigation';
export default function Favourite({ bookTitle, bookImg, bookAuthor, initialStatus }: { bookTitle: string, bookImg: string, bookAuthor: string, initialStatus: boolean | undefined }) {
    const { data: session } = useSession()
    const pathname = usePathname();
    const [favourite, setFavoutite] = useState<boolean | undefined>(initialStatus);
    return (
        <>
            {session && <div>
                <IconButton onClick={() => {
                    if (favourite) {
                        axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user?email=${session.user?.email}`, {
                            data: {
                                id: session.user?.email,
                                removeBook: { author: bookAuthor, title: bookTitle, img: bookImg, link: pathname }
                            },
                            headers: {
                                Authorization: `Bearer ${session.user?.name}`,
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': 'http://localhost:3000,https://wittpad-alpha.vercel.app',
                                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
                            }
                        })
                        setFavoutite(false);
                    } else {
                        axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user?email=${session.user?.email}`, {
                            id: session.user?.email,
                            savedBooks: { author: bookAuthor, title: bookTitle, img: bookImg, link: pathname }
                        }, {
                            headers: {
                                Authorization: `Bearer ${session.user?.name}`,
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': 'http://localhost:3000,https://wittpad-alpha.vercel.app',
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
