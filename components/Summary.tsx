'use client'
import openai from "@/openAi";
import client from "@/sanity/client";
import React, { useEffect, useState } from 'react'
async function uploadSummary(bookName: string, summaryArray: Array<{ keyidea: string, summary: string }>) {
    client
        .patch({ query: `*[_type == "book" && title == "${bookName}" ]` })
        .set({ wholeSummary: summaryArray })
        .commit({ autoGenerateArrayKeys: true })
        .then(() => {
        })
        .catch((err) => {
            console.error('the update failed: ', err.message)
        })
}

async function getSummaryFromSanity(bookName: string, authorName: string, setData: React.Dispatch<React.SetStateAction<string>>, setSanitySummary: React.Dispatch<React.SetStateAction<never[]>>, setStoredSummary: React.Dispatch<React.SetStateAction<SummaryType[]>>) {
    const beta = await client.fetch(`*[_type == "book" && title == "${bookName}" ]{wholeSummary}`, { cache: 'no-store' });
    if (beta.length == 0) {
        getSummaryFromGPT(bookName, authorName, setData, setStoredSummary)
    }
    else {
        if (beta[0].wholeSummary == null) {
            getSummaryFromGPT(bookName, authorName, setData, setStoredSummary)
        } else {
            setSanitySummary(beta[0].wholeSummary);
            setStoredSummary((prev) => {
                return ([...prev, { type: "sanity", Summary: beta[0].wholeSummary }])
            });
        }
    }
}

async function getSummaryFromGPT(bookName: string, authorName: string, setData: any, setStoredSummary: React.Dispatch<React.SetStateAction<SummaryType[]>>) {
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: `Generate a detailed summary of the book 'The Hobbit By: J.R.R. Tolkien, Douglas A. Anderson, Michael Hague (Illustrator)'. Please structure the summary in the following format: ^This is the first key idea@this is the summary of first key idea^this is the second key idea@this is the summary of the second key idea^this is the third key idea@this is the summary of the third key idea`
            },
            {
                role: "assistant",
                content: `^The Unexpected Journey@The Hobbit begins with Bilbo Baggins, a hobbit who lives a peaceful life in the Shire. Gandalf, a wizard, and a group of dwarves led by Thorin Oakenshield arrive at Bilbo's home and persuade him to join their quest to reclaim their homeland, Erebor, from the dragon Smaug. Initially hesitant, Bilbo eventually embarks on the adventure, and the group faces trolls, goblins, and other challenges. Bilbo discovers a magic ring that grants the wearer invisibility, which becomes a crucial asset on their journey.

                ^Character Development and Growth@As the journey progresses, Bilbo undergoes significant character development. Initially, he is seen as timid and reluctant, but as the story unfolds, he becomes more courageous, resourceful, and clever. He uses his wits to outsmart Gollum, a creature residing in the dark caves, and eventually acquires the One Ring. Bilbo's actions and decisions continually shape his character, showing his transformation from an ordinary hobbit to a hero.
                
                ^The Confrontation with Smaug and the Battle of the Five Armies@The central part of the story revolves around the confrontation with Smaug, where Bilbo plays a crucial role by exploiting the dragon's weak spot. After Smaug's demise, a conflict arises over the treasure, leading to the Battle of the Five Armies. Dwarves, men, elves, goblins, and eagles clash, and during this chaos, Bilbo displays bravery and wisdom by trying to negotiate peace.
                
                ^Friendship and Loyalty@Throughout the narrative, themes of friendship and loyalty are prevalent. Bilbo forms deep bonds with the dwarves, and their camaraderie becomes a vital aspect of their success. Loyalty is tested when various characters face dilemmas, but ultimately, the importance of standing together in the face of adversity is highlighted, showcasing the strength of unity and trust among the characters.
                
                ^Return and Personal Growth@Upon returning to the Shire, Bilbo realizes how much he has changed during his journey. Despite initial misunderstandings and judgments from his fellow hobbits, Bilbo's growth and experiences set him apart. He gains a deeper appreciation for the simple pleasures of home, family, and the comfort of his own surroundings.
                
                ^Legacy and Enduring Impact@The conclusion of the story not only marks the end of Bilbo's adventure but also hints at the larger world of Middle-earth and its continuing challenges. Bilbo's story becomes a part of the greater tale of Middle-earth, hinting at the events that will unfold in Tolkien's later works, such as "The Lord of the Rings."
                
                "The Hobbit" is an enchanting tale of bravery, personal growth, friendship, and the enduring impact of one individual's journey in a vast and magical world.`
            },
            {
                role: "user",
                content: `similarly generate the summary of the book The Man Who Knew Infinity by Robert Kanigel`
            },
            {
                role: "assistant",
                content: `^Prodigious Early Life and Mathematical Talent@The book delves into Ramanujan's early life in India, where his exceptional mathematical abilities became evident at a young age. Largely self-taught, he made significant discoveries in isolation, developing his own theorems and formulas, which later became the foundation of his unique mathematical legacy.

                ^Struggles and Recognition@Despite his mathematical genius, Ramanujan faced numerous challenges, including financial hardship and health issues. His lack of formal education and isolation from the mathematical community initially hindered the recognition of his work. However, with the help of G.H. Hardy, a prominent English mathematician, Ramanujan gained the acknowledgment and support necessary to showcase his talents on a global platform.
                
                ^Collaboration and Contributions@The book explores the collaboration between Ramanujan and Hardy, detailing their intellectual synergy. Their partnership led to numerous groundbreaking theories and formulas, particularly in the field of number theory, infinite series, and continued fractions. Ramanujan's contributions to mathematics, including his work on highly composite numbers, partition functions, and mock theta functions, revolutionized the field.`
            },
            {
                role: "user",
                content: `similarly generate the summary of the book A Year in the Life of William Shakespeare by James Shapiro`
            },
            {
                role: "assistant",
                content: `^The Political Climate and Shakespeare's Career@Shapiro's book delves into the political backdrop of 1599 England, a year rife with political tensions, upheavals, and power struggles. Against this backdrop, Shakespeare navigates his career as a playwright and actor, capitalizing on the social dynamics of the time to craft some of his most significant works.

                ^Shakespeare's Creative Endeavors@The book meticulously explores the creative process behind some of Shakespeare's renowned plays, including "Hamlet," "As You Like It," and "Julius Caesar." Shapiro draws connections between historical events, the cultural milieu, and the thematic elements within these plays, offering insights into Shakespeare's creative choices and inspirations.
                
                ^The Globe Theatre and Theater Business@Shapiro sheds light on the Globe Theatre, one of the primary venues for Shakespeare's plays. He discusses the business aspects of theater during that period, from the economics of playwriting to the social dynamics and audience reception of Shakespeare's work.
                
                ^Social and Cultural Context@The book immerses readers in the social fabric of late 16th-century London, exploring various aspects such as daily life, religious tensions, social hierarchies, and the plague's impact on society. Shapiro illustrates how these factors influenced Shakespeare's writing and the ways in which his works reflected the societal ethos.
                
                ^Relationships and Collaborations@Shapiro delves into Shakespeare's interactions with contemporaries and fellow playwrights, discussing how these relationships and collaborations may have influenced his work. Shapiro highlights the collaborative nature of theater production during this period and how it impacted the development of Shakespeare's plays.
                
                ^Legacy and Impact@The book emphasizes the lasting impact of the plays written during this pivotal year, not only on Shakespeare's own career but also on the broader literary canon. Shapiro elucidates how the plays from 1599 continue to be studied, performed, and revered, shaping the cultural landscape even centuries later.
                `
            },
            {
                role: "user",
                content: `similarly generate the summary of the book Hamlet by William shakespeare`
            },
            {
                role: "assistant",
                content: `^Royal Turmoil and the Ghost of Hamlet's Father@The play opens in the Danish kingdom with a sense of unease following the death of King Hamlet. His ghost appears, revealing to his son, Prince Hamlet, that he was murdered by his brother, Claudius, who has since married Hamlet's mother, Queen Gertrude, and assumed the throne.

                ^The Moral and Psychological Struggle of Hamlet@Hamlet is torn between avenging his father's murder and the moral complexities of the act. He feigns madness, struggling with inner conflicts, indecision, and existential questions about life, death, and the afterlife. The famous soliloquies, particularly "To be or not to be," encapsulate his inner turmoil.
                
                ^Deception and Tragedy@The play unfolds with deceit and manipulation. Hamlet pretends to be mad, using this guise to uncover the truth. However, his actions lead to tragic consequences, including the death of Polonius, the father of Ophelia, whom Hamlet loves. Ophelia's madness and subsequent death further fuel Hamlet's distress.
                
                ^Revenge and the Play within a Play@To confirm Claudius's guilt, Hamlet devises a plan to stage a play mirroring the circumstances of his father's murder. Claudius's reaction confirms Hamlet's suspicions, validating the ghost's claim and intensifying the need for revenge.
                
                ^The Tragic Climax@As tensions rise, Hamlet mistakenly kills Polonius, leading to a chain of events that culminate in a duel between Laertes, Ophelia's brother, and Hamlet. The play reaches its tragic apex in a sequence of poisoning, resulting in multiple deaths – including the royal family, Laertes, Claudius, Gertrude, and Hamlet himself.
                
                ^The Tragic Resolution@In the final moments, Hamlet makes amends with Laertes and reveals the truth about the poison. With his dying breath, Hamlet urges his friend Horatio to tell his story and prevent further bloodshed.
                `
            },
            {
                role: "user",
                content: `similarly Generate a detailed summary of the book '${bookName} By: ${authorName}`
            },
            {
                role: "assistant",
                content: ``
            }
        ],
        stream: true,
    });
    let keyIdeas: Array<string> = [];
    let summaries: Array<string> = [];
    let str = '';
    for await (const chunk of completion) {
        const data = chunk.choices[0].delta.content;
        if (data) {
            setData((newstr: string) => {
                let result = newstr;
                if (data.includes('^')) {
                    result += `<p style="font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; color: rgb(23 37 84 / var(--tw-text-opacity)); --tw-text-opacity: 1;    margin-top: 1rem; margin-bottom: 0.5rem;">${data.replace("^", "")}</p>`;
                    if (str != '') {
                        summaries.push(str);
                    }
                    str = data.replace("^", "");
                } else if (data.includes('@')) {
                    keyIdeas.push(str);
                    str = data.replace("@", "");
                    result += `<p style="font-size: 1rem; line-height: 1.75rem; --tw-text-opacity: 1; color: rgb(23 37 84 / var(--tw-text-opacity)); margin-top: 0.5rem; margin-bottom: 0.5rem;">${data.replace("@", "")}</p>`;
                } else {
                    str += data;
                    let l = newstr.length - 4;
                    result = newstr.slice(0, l);
                    result = result + data;
                    result += "</p>"
                }
                return (result)
            })
        }
    }
    if (str != '') {
        summaries.push(str);
    }
    const summaryArray: Array<{ keyidea: string, summary: string }> = []
    for (let i = 0; i < keyIdeas.length; i++) {
        summaryArray.push({ keyidea: keyIdeas[i], summary: summaries[i] })
    }
    uploadSummary(bookName, summaryArray);
    setStoredSummary(prev => {
        return ([...prev, { type: "gpt", Summary: summaryArray }])
    })
}
interface SummaryType {
    type: string;
    Summary: any;
}

export default function Summary({ bookName, authorName }: { bookName: string, authorName: string }) {
    const [sanitySummary, setSanitySummary] = useState([]);
    const [storedSummary, setStoredSummary] = useState<SummaryType[]>([]);
    const [data, setData] = useState('');
    const [summaryNumber, setSummaryNumber] = useState<number|undefined>(1);
    const [currentSummary,setCurrentSummary]=useState([]);
    console.log(summaryNumber);
    useEffect(() => {
        if (bookName && authorName) {
            getSummaryFromSanity(bookName, authorName, setData, setSanitySummary, setStoredSummary);
        }
    }, [bookName, authorName])
    useEffect(()=>{
        if(summaryNumber!=undefined && storedSummary.length>0){
            console.log("I came here");
            setCurrentSummary(storedSummary[summaryNumber-1].Summary);
        }
    },[summaryNumber,storedSummary])
    console.log('this is currentSummary ',currentSummary,storedSummary);
    return (
        <>
            {data !== '' ? (
                <div dangerouslySetInnerHTML={{ __html: data }} />
            ) : (
                currentSummary.map((obj: any, key: number) => (
                    <div key={key} className='my-4'>
                        <p className='text-[1.25rem] font-bold text-blue-950'>{obj.keyidea}</p>
                        <p className='text-[1rem] text-blue-950'>{obj.summary}</p>
                    </div>
                ))
            )}
            <button className='py-3 px-10 font-semibold text-base text-blue-950 md:inline hidden border-0 bg-green-400 rounded' onClick={() => {
                if (bookName && authorName) {
                    setData("");
                    getSummaryFromGPT(bookName, authorName, setData, setStoredSummary);
                }
            }}>Generate new summary</button>
            <button onClick={() => {
                setSummaryNumber((prev: number|undefined) => {
                    if (prev!=undefined && prev < storedSummary.length) {
                        return (prev + 1);
                    }else{
                        return storedSummary.length
                    }
                })
            }
            }>Next</button>
            <button onClick={() => {
                setSummaryNumber((prev: number|undefined) => {
                    if (prev!=undefined && prev > 1) {
                        return (prev -1);
                    }else{
                        return 1;
                    }
                })
            }}>Previous</button>

        </>
    )
}
