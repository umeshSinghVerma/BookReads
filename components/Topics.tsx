import Link from "next/link";
import React from 'react'

export default function Topics({ bookId, topics }: { bookId: string,  topics: Array<string> }) {
    let data: Array<string> = [];
    if (topics && topics.length > 0) {
        topics.forEach(element => {
            if(element.trim()!=''){
                data.push(element.trim());
            }
        });
    }
    return (
        <div>
            <div>
                {data.length > 0 && <div className='font-bold text-sm text-blue-950 my-5'>
                    Topics
                </div>}
            </div>
            <div className='flex flex-wrap  p-1 cursor-pointer gap-6 whitespace-nowrap'>
                {
                    data.length > 0 && (data.map((topic: string, key: number) => {
                        if (topic != "") {
                            return (
                                <Link href={'#'} key={key} className='text-center min-w-min md:w-[30%] flex-grow bg-[#f1f6f4] p-3 border-2 border-transparent hover:border-green-400 hover:rounded-md'>
                                    <p className=''>{topic}</p>
                                </Link>
                            )
                        }
                        else {
                            return null;
                        }
                    }))
                }
            </div>
        </div>
    )
}
