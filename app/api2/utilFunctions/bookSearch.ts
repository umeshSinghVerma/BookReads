const puppeteer = require('puppeteer');
export default async function bookSearch (bookName:any) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const bookToSearch = encodeURIComponent(bookName);
    try {
        await page.goto(`https://biblioreads.eu.org/search/${bookToSearch}?type=books`);
        await page.waitForSelector('#booksSearchResults', { visible: true, timeout: 60000 });
        const element = '#booksSearchResults a'
        const booksData = await page.$$eval(element, (anchors:any) => {
            const books = anchors.map((anchor:any) => {
                const title = anchor.querySelector('h3').textContent.trim();
                const author = anchor.querySelector('p').textContent.trim();
                const rating = anchor.querySelector('span.capitalize').textContent.trim();
                const coverImage = `https://biblioreads.eu.org${anchor.querySelector('img').getAttribute('src')}`;
                // const link = `https://biblioreads.eu.org${anchor.getAttribute('href')}`;
                const link = anchor.getAttribute('href');
                const bookInfo = {
                    title,
                    author,
                    rating,
                    coverImage,
                    link
                };

                return bookInfo;
            });

            return books;
        });
        const dataToSave = {
            "data": booksData
        };

        return dataToSave;
    }
    catch (err) {
        console.log(err)
        return {}
    } finally {
        await browser.close();
    }
};