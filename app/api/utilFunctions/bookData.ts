import { GetAuthorData } from "./AuthorData";

const puppeteer = require('puppeteer');

export default async function getBookData(url:any) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();



    try {

        console.log("this is the url", url);
        const link = url.replace(/^"|"$/g, '');
        await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });

        await page.waitForSelector('#bookContent', { visible: true, timeout: 60000 });

        const description = await page.evaluate(() => {
            const bookDescriptionElement = document.querySelector('#bookContent #bookDescription > p');
            if (bookDescriptionElement) {
                let text = bookDescriptionElement?.textContent?.trim();
                if(text){
                    text = text.replace(/\(Show less\)$/, '').trim();
                    return text;
                }else{
                    return "";
                }
            }
            return '';
        });

        const topics = await page.evaluate(() => {
            const bookTopicElement = document.querySelector('#bookContent #bookGenres > span');
            if (bookTopicElement) {
                let text = bookTopicElement?.textContent?.trim();
                return text;
            }
            return '';
        });

        const bookRating = await page.evaluate(() => {
            const bookRatingElement = document.querySelector('#bookContent #bookRating > div > div > span');
            if (bookRatingElement) {
                let rating = bookRatingElement?.textContent?.trim();
                return rating;
            }
            return '';
        });

        await page.waitForSelector('#sideContent', { visible: true, timeout: 60000 });
        const slogan = await page.evaluate(() => {
            const sloganElement = document.querySelector('#sideContent a');
            if (sloganElement) {
                let slogan = sloganElement?.textContent?.trim();
                return slogan;
            }
            return '';
        });
        const authorss = await page.evaluate(() => {
            const sloganElement = document.querySelector('#sideContent div');
            let authors:Array<{name:string|undefined,url:string}> = [];

            if (sloganElement) {
                Array.from(sloganElement.children).map((spanElement) => {
                    if (spanElement.children.length == 1) {
                        let AuthorObject = {
                            name: spanElement.children[0]?.textContent?.replace(',',"").trim(),
                            url: `https://biblioreads.eu.org${spanElement.children[0].getAttribute('href')}`,
                        };
                        if(AuthorObject.name && AuthorObject.url){
                            authors.push(AuthorObject);
                        }
                    }
                });
                return authors;
            }
            return "jkhjk";
        });

        const finalAuthorArray = async function(){
            let authors = [];
            for(let i = 0; i < authorss.length; i++){
                let author = authorss[i];
                let authorDescription = await GetAuthorData(author.url,browser);
                let authorObject = {
                    authorName: author.name,
                    aboutAuthor: authorDescription
                };
                authors.push(authorObject);
            }
            return authors;
        }
        const AuthorDetails = await finalAuthorArray();

        const title = await page.evaluate(() => {
            const titleElement = document.querySelector('#sideContent h1');
            if (titleElement) {
                let title_ = titleElement?.textContent?.trim();
                return title_;
            }
            return '';
        });

        const author = await page.evaluate(() => {
            const authorElement = document.querySelector('#sideContent div');
            if (authorElement) {
                let author_ = authorElement?.textContent?.trim();
                return author_;
            }
            return '';
        });

        const imgUrl = await page.evaluate(() => {
            const imgElement = document.querySelector('#sideContent #bookCover picture img');
            if (imgElement) {
                let imgSrc = imgElement.getAttribute('src');
                return imgSrc;
            }
            return '';
        });

        const dataToSave = {
            "topics": topics,
            "description": description,
            "rating": bookRating,
            "slogan": slogan,
            "title": title,
            "author": author,
            "AuthorDetails":AuthorDetails,
            "imgUrl": `https://biblioreads.eu.org${imgUrl}`
        };

        return dataToSave;
    } catch (err:any) {
        if (err.name === 'TimeoutError') {
            console.log("Timeout occurred, returning empty object");
            return {}; // Returning an empty object
        } else {
            console.log(err);
            return {}; // Catch other errors and return an empty object
        }
    } finally {
        await browser.close(); // Close the browser after finishing the operations
    }
}
