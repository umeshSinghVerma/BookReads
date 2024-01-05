const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_BARD_API);

import client from "@/sanity/client";
async function uploadSummary(bookName: string, summary: string) {
    client
        .patch({ query: `*[_type == "book" && title == "${bookName}" ]` })
        .set({ wholeSummary: summary })
        .commit({ autoGenerateArrayKeys: true })
        .then(() => {
        })
        .catch((err) => {
            console.error('the update failed: ', err.message)
        })
}

async function getSummaryFromSanity(bookName: string, authorName: string) {
    const beta = await client.fetch(`*[_type == "book" && title == "${bookName}" ]{wholeSummary}`, { cache: 'no-store' });
    if (beta.length == 0) {
        getSummaryFromGPT(bookName, authorName);
    }
    else {
        if (!beta[0].wholeSummary) {
            getSummaryFromGPT(bookName, authorName)
        } else {
            return beta[0].wholeSummary;
        }
    }
}

async function getSummaryFromGPT(bookName: string, authorName: string) {
    console.log("i am h")
    let keyIdeas: Array<string> = [];
    let summaries: Array<string> = [];
    let str = '';
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Summarize the plot ofthe book ${bookName} by ${authorName} and aim for a length of approximately 500 words.`


    const result = await model.generateContentStream(prompt);
    let sum = '';
    for await (const chunk of result.stream) {
        const data = chunk.text();
        sum += data;
    }
    uploadSummary(bookName, sum);
    return sum;
}
export default async function Summary({ bookName, authorName }: { bookName: string, authorName: string }) {
    const data = await getSummaryFromSanity(bookName, authorName);
    return (
        <div>
            <p className='md:text-xl font-bold text-blue-950'>Summary</p>
            <div className="my-4" dangerouslySetInnerHTML={{__html:data}}></div>
        </div>
    )
}
