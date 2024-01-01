'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

export default function LoginButton() {
    const { data: session } = useSession()
    return (
        <Link href={session ? "/savedBooks":"/login"} className='py-3 px-10 font-semibold text-base text-blue-950 md:inline hidden border-0 bg-green-400 rounded'>{session ? "Saved Books":`Log in to Listen Audio`}</Link>
    )
}

