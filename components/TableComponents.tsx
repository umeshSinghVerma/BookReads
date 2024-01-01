'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
export default function TableComponents({ summaryLength, title }: { summaryLength: number, title: string }) {
    const [showTableContent, setShowtableContent] = useState(false);
    return (
        <div className='flex flex-col gap-5'>
            <button className='font-bold text-sm text-start text-blue-950' onClick={() => (setShowtableContent(!showTableContent))}>
                <span>Table of Contents</span>
                {
                    showTableContent ? (
                        <ArrowDropUpIcon />
                    ) : (
                        <ArrowDropDownIcon />
                    )
                }
            </button>
            {showTableContent && <div className='underline text-sm flex flex-col gap-2'>
                <Link href={"#summary"}>{`${title} Summary of key ideas`}</Link>
                <Link href={"#aboutbook"}>{`What is ${title} about`}</Link>
                <Link href={"#bestquotes"}>{`Best quotes from ${title}`}</Link>
                <Link href={"#aboutauthor"}>{`About the Author`}</Link>
            </div>}
        </div>
    )
}
