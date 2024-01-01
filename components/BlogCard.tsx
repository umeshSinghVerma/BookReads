import Image from 'next/image'
import React from 'react'

type proptype = {
    imgurl: string,
    title: string,
    paragraph: string
}

export default function BlogCard(props: proptype) {
    return (
        <div className='flex flex-col group flex-grow md:max-w-[400px] my-4'>
            <div className='relative'>
                <img
                    className=''
                    src={props.imgurl}
                    alt={props.title}
                    style={{
                        transition: '0.3s', // Add a smooth transition
                    }}
                />
                <div className='overlay'></div>
            </div>
            <h1 className='text-blue-950 group-hover:text-blue-700 text-3xl font-bold my-4'>{props.title}</h1>
            <p className='text-blue-950'>{props.paragraph}</p>

            <style jsx>
            {`
            .overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #476681; // Bluish overlay color with transparency
                opacity: 0; // Initially, the overlay is not visible
                transition: opacity 0.3s; // Add a smooth transition for the overlay
            }
    
            .overlay:hover {
                opacity: 0.8; // Show the overlay on hover
            }
        `}</style>
        </div>
    );
}