import Footer from '@/components/Footer'
import Header from '@/components/Header'
import LoginButton from '@/components/LoginButton'
import RatingCards from '@/components/RatingCards'
import client from '@/sanity/client'
import Link from 'next/link'
require("dotenv").config();

export default function Home() {
  const ratings = [
    {
      rating: 5,
      text: `It's highly addictive to get core insights on personally relevant topics without repetition or triviality. Added to that the apps ability to suggest kindred interests opens up a foundation of knowledge.`,
      user: 'Sven O.'
    },
    {
      rating: 5,
      text: `Great app. Good selection of book summaries you can read or listen to while commuting. Instead of scrolling through your social media news feed, this is a much better way to spend your spare time in my opinion.`,
      user: 'Thi Viet Quynh N.'
    },
    {
      rating: 5,
      text: `Great app. Good selection of book summaries you can read or listen to while commuting. Instead of scrolling through your social media news feed, this is a much better way to spend your spare time in my opinion.`,
      user: 'Thi Viet Quynh N.'
    },
    {
      rating: 5,
      text: `Great app. Good selection of book summaries you can read or listen to while commuting. Instead of scrolling through your social media news feed, this is a much better way to spend your spare time in my opinion.`,
      user: 'Thi Viet Quynh N.'
    },
  ]
  async function changFn() {
    // const posts = await client.fetch('*[_type == "book" && title == "the Hobbit"]')

    // TO Delete the post haaving empty titles
    const posts = await client.fetch('*[_type == "book" && title == null]')
    posts.forEach((element:any) => {
      client
        .delete(`${element._id}`)
        .then(() => {
          console.log('Bike deleted')
        })
        .catch((err) => {
          console.error('Delete failed: ', err.message)
        })
    });




    console.log('this is posts ', posts)
    // const treat = posts[0];
    // const refobt = treat.other._ref;
    // const alpha = await client.getDocument("image-534a6c489d81447449ab093ec94156c786e14a14-6000x4000-jpg");
    // console.log("this is posts ",alpha);
    // const post = {
    //   _name: 'post',
    //   _type: 'document',
    //   title: 'PostTitle',
    //   fields: [
    //     {
    //       name: 'trial9',
    //       label: 'Tria9 1',
    //       type: 'string'
    //     },
    //   ]
    // }
    // const posts = await client.create(post)
    // console.log("this is the post ",post);
    // const data = await client.fetch(`*[ _type == 'trial' ]`)
    // console.log(`Number of documents: ${JSON.stringify(data)}`)
    // const alpha = await client.fetch(`count(*)`)
    // console.log(`Number of documents: ${JSON.stringify(alpha)}`)
    // client
    //   .delete('056ba845-4d23-4f1e-acb1-f5df26240f61')
    //   .then(() => {
    //     console.log('Bike deleted')
    //   })
    //   .catch((err) => {
    //     console.error('Delete failed: ', err.message)
    //   })

    // client.patch('7d49cac7-26ae-4106-b102-7851a8eabe6c').unset(['trial']).commit()


    // Code to update any thing inside the sanity document


    // client
    //   .patch({query : "*[ _type == 'trial' && trial1 == 'newhelloupdated' ]"}) // Document ID to patch
    //   // .set({ trial1: "newhelloupdated" }) // Shallow merge
    //   .setIfMissing({arraytrial: []})
    //   // .insert('after', 'arraytrial[-1]', ['this is added in first position now upar']) // whenever there is the single thing to add into the array ;  here arraytrial is the name of the array and -1 is the position where we want to add the new element into the array
    //   // .append('arraytrial', ['this is to last'])
    //   .insert('after','arraytrial[-1]',[{bookname:'firstbook',bookname2:'secondbook'}])
    //   .commit({autoGenerateArrayKeys: true}) // Perform the patch and return a promise
    //   .then((updatedBike) => {
    //     console.log('Hurray, the bike is updated! New document:')
    //     console.log(updatedBike)
    //   })
    //   .catch((err) => {
    //     console.error('Oh no, the update failed: ', err.message)
    //   })

    // client
    //   .patch({ query: "*[ _type == 'book' && title == 'Het hijgend hert']" })
    //   .setIfMissing({book_AllAuthors: []})
    //   .append('book_AllAuthors', [{ authorName: 'dfdsdfsdfs', authorAbout: 'dimati' }])
    //   .commit({autoGenerateArrayKeys: true})
    //   .then((updatedBike:any) => {
    //     console.log('fasdfsadfasfasdfasfdf a sdafasdfasdfada:')
    //     console.log(updatedBike)
    //   })
    //   .catch((err:any) => {
    //     console.error('Oh no, the update failed: ', err.message)
    //   })




    // {
    //   dataupdae.map(data => {
    //     const doc = {
    //       _type: 'category',
    //       name: data.name,
    //       topics: data.topics
    //     }
    //     client.create(doc).then((res) => {
    //       console.log(`Bike was created, document ID is ${res._id}`)
    //     })
    //   })
    // }
  }
  // changFn();
  return (
    <div>
      <Header />
      <div className='lg:w-[65%] m-auto p-[18px]'>
        <div>
          <div className='w-full mb-10 relative md:inline hidden'>
            <img src="/herodesktop.png" alt='alpha' />
            <div className='my-4 absolute bottom-[30%] left-[3.5%]'>
              <LoginButton />
            </div>
          </div>
          <div className='w-full mb-10 md:hidden flex flex-col justify-center items-center'>
            <img src="/heromobileheading.png" alt="heading" />
            <div className='my-4'>
              <LoginButton />
            </div>
            <img src="/heromobile.png" alt='alpha' />
          </div>
          <div className='text-center md:text-3xl md:mt-10 font-bold text-blue-950 mb-5'>
            Understand books & podcasts in 15 minutes
          </div>
          <div className='flex flex-wrap justify-between'>
            <div className='flex md:flex-col gap-5 md:gap-0 items-center justify-center md:max-w-[200px]'>
              <img src="/keyIdeas.svg" alt="" width={80} height={50} />
              <div>
                <div className=' md:text-xl font-bold text-blue-950 md:mb-5'>
                  Read or listen
                </div>
                <div className='text-sm md:text-base text-blue-950 mb-5'>
                  Get the key ideas from nonfiction bestsellers in minutes, not hours.
                </div>
              </div>
            </div>
            <div className='flex md:flex-col gap-5 md:gap-0 items-center justify-center md:max-w-[200px]'>
              <img src="/bulb.svg" alt="" width={80} height={50} />
              <div>
                <div className=' md:text-xl font-bold text-blue-950 md:mb-5'>
                  Find your next read
                </div>
                <div className='text-sm md:text-base text-blue-950 mb-5'>
                  Get book lists curated by experts and personalized recommendations.
                </div>
              </div>
            </div>
            <div className='flex md:flex-col gap-5 md:gap-0 items-center justify-center md:max-w-[200px]'>
              <img src="/shortcast.svg" alt="" width={80} height={50} />
              <div>
                <div className=' md:text-xl font-bold text-blue-950 md:mb-5'>
                  Shortcasts
                </div>
                <div className='text-sm md:text-base text-blue-950 mb-5'>
                  {`We've teamed up with podcast creators to bring you key insights from podcasts.`}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex w-full flex-col md:flex-row my-16 gap-3 justify-between'>
          <div className='md:text-3xl text-xl font-bold text-gray-500 whitespace-nowrap gap-3 flex flex-col'>
            <p className='text-blue-950'>Be more knowledgeable</p>
            <p>Be more successful</p>
            <p>Be healthier</p>
            <p>Be a better parent</p>
            <p>Be happier</p>
            <p>Be your best self!</p>
          </div>
          <div className='bg-[#f1f6f4] px-6 py-12 md:max-w-[50%] text-sm md:text-xl flex flex-col text-gray-700 justify-between items-center'>
            <div className='flex gap-3'>
              <span className='text-blue-600 font-bold'>95%</span>
              <div>of Blinkist members <span className='font-bold'>read significantly more</span> than before*</div>
            </div>
            <div className='flex gap-3'>
              <span className='text-blue-600 font-bold'>95%</span>
              <div>of Blinkist members <span className='font-bold'>read significantly more</span> than before*</div>
            </div>
            <div className='flex gap-3'>
              <span className='text-blue-600 font-bold'>95%</span>
              <div>of Blinkist members <span className='font-bold'>read significantly more</span> than before*</div>
            </div>
          </div>
        </div>
        <div className='flex w-full flex-col md:flex-row mt-16 justify-around gap-12 md:items-center'>
          <div>
            <img src="https://www.blinkist.com/packs/static/use-cases/images/image_en@2x-31f2ab90ccaaf56e5713.png" alt="" className='max-h-[400px]' />
          </div>
          <div className='md:text-3xl text-xl font-bold text-gray-500 whitespace-nowrap gap-3 flex flex-col'>
            <p className='text-blue-950'>Feed your brain while</p>
            <p>Driving</p>
            <p>Commuting</p>
            <p>Doing housework</p>
            <p>Walking</p>
            <p>Relaxing</p>
            <div className='my-4'>
              <LoginButton />
            </div>
          </div>
        </div>
        <div className='text-center md:text-3xl font-bold text-blue-950 mb-5 md:mt-8'>
          What our members say
        </div>
        <div className='flex justify-center flex-col gap-8 items-center'>
          {
            ratings.map((rate, key) => {
              return (
                <RatingCards rating={rate.rating} text={rate.text} user={rate.user} key={key} />
              )
            })
          }
        </div>
      </div>
      <div className='my-4 flex justify-center'>
        <LoginButton />
      </div>
      {/* <div className='text-center md:text-3xl font-bold text-blue-950 mb-5 mt-10'>
        Start growing with Blinkist now
      </div>
      <div>
        <div className='flex flex-col bg-[#d7e9ff] p-[28px] w-min items-center justify-center rounded-2xl'>
          <img src="/crown.svg" alt="" height={60} width={60} />
          <p className='text-4xl text-blue-950 font-extrabold whitespace-nowrap'>28 Million</p>
          <p className='text-sm text-gray-700 whitespace-nowrap'>Downloads on all platforms</p>
        </div>
      </div> */}

      <Footer />
    </div>
  )
}
