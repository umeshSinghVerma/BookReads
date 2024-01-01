'use client'
import BlogCard from '@/components/BlogCard'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React from 'react'

export default function page() {
    const articles = [
        {
            imgurl: 'https://businessblog.blinkist.com/wp-content/uploads/2023/10/BlogHeaderImages_Blinkist-for-Business-23.png',
            title: 'Failing at Work Can Make You More Successful',
            paragraph: `Failure isn't fun, but it can teach us valuable lessons. Instead of viewing failure as a setback, reframe it as a stepping stone on the road to success. To do that, you'll need resilience.`
        },
        {
            imgurl: 'https://businessblog.blinkist.com/wp-content/uploads/2023/10/BlogHeaderImages_Blinkist-for-Business-23.png',
            title: 'Failing at Work Can Make You More Successful',
            paragraph: `Failure isn't fun, but it can teach us valuable lessons. Instead of viewing failure as a setback, reframe it as a stepping stone on the road to success. To do that, you'll need resilience.`
        },
        {
            imgurl: 'https://businessblog.blinkist.com/wp-content/uploads/2023/10/BlogHeaderImages_Blinkist-for-Business-23.png',
            title: 'Failing at Work Can Make You More Successful',
            paragraph: `Failure isn't fun, but it can teach us valuable lessons. Instead of viewing failure as a setback, reframe it as a stepping stone on the road to success. To do that, you'll need resilience.`
        },
        {
            imgurl: 'https://businessblog.blinkist.com/wp-content/uploads/2023/10/BlogHeaderImages_Blinkist-for-Business-23.png',
            title: 'Failing at Work Can Make You More Successful',
            paragraph: `Failure isn't fun, but it can teach us valuable lessons. Instead of viewing failure as a setback, reframe it as a stepping stone on the road to success. To do that, you'll need resilience.`
        },
        {
            imgurl: 'https://businessblog.blinkist.com/wp-content/uploads/2023/10/BlogHeaderImages_Blinkist-for-Business-23.png',
            title: 'Failing at Work Can Make You More Successful',
            paragraph: `Failure isn't fun, but it can teach us valuable lessons. Instead of viewing failure as a setback, reframe it as a stepping stone on the road to success. To do that, you'll need resilience.`
        },
        {
            imgurl: 'https://businessblog.blinkist.com/wp-content/uploads/2023/10/BlogHeaderImages_Blinkist-for-Business-23.png',
            title: 'Failing at Work Can Make You More Successful',
            paragraph: `Failure isn't fun, but it can teach us valuable lessons. Instead of viewing failure as a setback, reframe it as a stepping stone on the road to success. To do that, you'll need resilience.`
        },
    ]
    return (
        <div>
            <div className='lg:w-[70%] m-auto p-[18px]'>
                <div className='flex flex-col md:flex-row justify-between text-blue-950 text-sm border-b-2 border-blue-950 pb-2 font-bold'>
                    <button>Articles</button>
                    <button>Case Studies</button>
                    <button>Ebooks</button>
                    <button>Webinars</button>
                    <button><img src="/search.svg" alt="" width={20} height={20} /></button>
                </div>
                <div className='flex flex-wrap gap-4 mt-8 justify-around'>
                    {
                        articles.map((article, key) => {
                            return (
                                <BlogCard
                                    imgurl={article.imgurl}
                                    title={article.title}
                                    paragraph={article.paragraph}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
