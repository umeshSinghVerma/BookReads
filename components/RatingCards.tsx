import React from 'react'

type propType = {
    rating: number,
    user: string,
    text: string
}
export default function RatingCards(props: propType) {
    return (
        <div className='md:w-[60%] bg-[#fff3d7] p-5'>
            <div className='flex gap-3'>
                <div>{props.user}</div>
                <div className='flex gap-1'>
                    {Array.from({ length: props.rating }, (_, index) => (
                        <img key={index} src="/starblue.svg" alt="Star" height={15} width={15} />
                    ))}
                </div>
            </div>
            <div>
                <p>{props.text}</p>
            </div>
        </div>
    )
}
