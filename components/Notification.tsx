'use client'
import React, { useState } from 'react'

export default function Notification() {
    const [show,setShow]=useState(true);
    return (
        <>
        { show &&
            (<div className='text-center text-sm text-red-700 bg-[#ebd6c6] p-2'>
                "Working on the site, currently featuring minimal requirements. Stay tuned for continuous updates!"
                <button className='ml-3' onClick={()=>setShow(!show)}>X</button>
            </div>)
            
        }
        </>
    )
}
