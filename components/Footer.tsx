import React from 'react'

export default function Footer() {
    const popularTitles = [
        "Atomic Habits",
        "The 5 AM Club",
        "The 7 Habits of Highly Effective People",
        "Rich Dad, Poor Dad",
        "12 Rules For Life",
        "Thinking, Fast and Slow",
        "Zero to One",
        "13 Things Mentally Strong People Don't Do",
        "Think and Grow Rich",
        "The Subtle Art of Not Giving a F*ck"
    ];

    const popularCategories = [
        "Personal Development",
        "Psychology",
        "Productivity",
        "Career & Success",
        "Management & Leadership",
        "Science",
        "Motivation & Inspiration",
        "Mindfulness & Happiness",
        "Money & Investments",
        "Communication Skills"
    ];

    const popularTopics = [
        "Best Christianity Books",
        "Best Memoirs Books",
        "Best Love Books",
        "Best Self-Help Books",
        "Best Leadership Books",
        "Best Spirituality Books",
        "Best Autobiographies Books",
        "Best Biographies Books",
        "Best Inspiration Books",
        "Best Persuasion Books"
    ];
    const trendingTopics = [
        "Natural Sciences Books",
        "Writing Books",
        "Meditation Books",
        "Mathematics Books",
        "Stoicism Books",
        "Education & Upbringing Books",
        "Sports Books",
        "Sex Books",
        "Wars Books",
        "Marketing Books"
      ];
      
      const featuredTitles = [
        "A Court of Thorns and Roses",
        "Just Mercy",
        "Tuesdays with Morrie",
        "Into the Wild",
        "The Devil in the White City",
        "Walden",
        "The Souls of Black Folk",
        "David and Goliath",
        "The Myth of Sisyphus",
        "Genesis"
      ];

      const editorialSection = [
        "Book lists",
        "What is Nonfiction?",
        "What to Read Next",
        "Benefits of Reading"
      ];
      
      // Useful links
      const usefulLinks = [
        "Pricing",
        "Blinkist Business",
        "Gift Cards",
        "Authors & Publishers",
        "Blinkist Magazine",
        "Cancel Subscription",
        "Contact & Help"
      ];
      
      // Company
      const company = [
        "About",
        "Careers",
        "Partners",
        "Code of Conduct",
        "Press Room"
      ];

    return (
        <div className='bg-[#f1f6f4]'>
            <div className='mt-16 p-[3rem] flex flex-col lg:w-[65%] m-auto'>
                <div>
                    <h1 className='m-auto text-xl font-bold text-blue-950 my-5'>Discover the Wittpad catalogue</h1>
                </div>
                <div className='flex overflow-x-auto gap-9 justify-between'>
                    <div>
                        <h1 className='m-auto font-bold text-blue-950 my-5'>Popular titles</h1>
                        {popularTitles.length > 0 && popularTitles.map((title, key) => {
                            return (
                                <div key={key} className='text-[#3a4649] my-4 text-sm whitespace-nowrap'>
                                    {title}
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        <h1 className='m-auto font-bold text-blue-950 my-5'>Popular categories</h1>
                        {popularCategories.length > 0 && popularCategories.map((title, key) => {
                            return (
                                <div key={key} className='text-[#3a4649] my-4 text-sm whitespace-nowrap'>
                                    {title}
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        <h1 className='m-auto font-bold text-blue-950 my-5'>Popular topics</h1>
                        {popularTopics.length > 0 && popularTopics.map((title, key) => {
                            return (
                                <div key={key} className='text-[#3a4649] my-4 text-sm whitespace-nowrap'>
                                    {title}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='flex overflow-x-auto gap-9 justify-between'>
                    <div>
                        <h1 className='m-auto font-bold text-blue-950 my-5'>Trending topics</h1>
                        {trendingTopics.length > 0 && trendingTopics.map((title, key) => {
                            return (
                                <div key={key} className='text-[#3a4649] my-4 text-sm whitespace-nowrap'>
                                    {title}
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        <h1 className='m-auto font-bold text-blue-950 my-5'>Featured titles</h1>
                        {featuredTitles.length > 0 && featuredTitles.map((title, key) => {
                            return (
                                <div key={key} className='text-[#3a4649] my-4 text-sm whitespace-nowrap'>
                                    {title}
                                </div>
                            )
                        })}
                    </div>
                    <div></div>
                </div>
                <div className='flex flex-wrap gap-9 justify-between my-5'>
                    <div>Logo</div>
                    <div>
                        <h1 className='m-auto font-semibold text-sm text-blue-950 my-5'>Editorial</h1>
                        {editorialSection.length > 0 && editorialSection.map((title, key) => {
                            return (
                                <div key={key} className='text-[#3a4649] my-4 text-sm whitespace-nowrap'>
                                    {title}
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        <h1 className='m-auto font-semibold text-sm text-blue-950 my-5'>Useful Links</h1>
                        {usefulLinks.length > 0 && usefulLinks.map((title, key) => {
                            return (
                                <div key={key} className='text-[#3a4649] my-4 text-sm whitespace-nowrap'>
                                    {title}
                                </div>
                            )
                        })}
                    </div>
                    <div>
                        <h1 className='m-auto font-semibold text-sm text-blue-950 my-5'>Company</h1>
                        {company.length > 0 && company.map((title, key) => {
                            return (
                                <div key={key} className='text-[#3a4649] my-4 text-sm whitespace-nowrap'>
                                    {title}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
