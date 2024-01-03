export async function GetAuthorData(authorUrl:string,browser:any) {
    const newpage = await browser.newPage();
    try {
        console.log("this is the url", authorUrl);
        const link = authorUrl.replace(/^"|"$/g, '');
        await newpage.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });

        await newpage.waitForSelector('#authorContent', { visible: true, timeout: 60000 });


        const authorDescription = await newpage.evaluate(() => {
            const bookDescriptionElement = document.querySelector('#authorContent #authorDescription > span');
            if (bookDescriptionElement) {
                let text = bookDescriptionElement?.textContent?.trim();
                text = text?.replace(/\(Show less\)$/, '').trim();
                return text;
            }
            return '';
        });
        return authorDescription;

    }
    catch (err:any) {
        if (err.name === 'TimeoutError') {
            console.log("Timeout occurred, returning empty object");
            return {}; // Returning an empty object
        } else {
            console.log(err);
            return {}; // Catch other errors and return an empty object
        }

    }
}