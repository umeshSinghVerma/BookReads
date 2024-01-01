const authorDetails = {
    name: 'authorDetails',
    type: 'document',
    title: "Author",
    fields: [
        {
            name: 'authorName',
            title: "Author",
            type: 'string'
        },
        {
            name:'aboutAuthor',
            title:'About',
            type: 'string'
        },
        {
            name: 'books',
            title: 'Books Written',
            type: 'array',
            of: [{
                    name: 'booksWritten',
                    title: "Books",
                    type: 'reference',
                    to: [{ type: 'book' }]
                }]
        }
    ]
}
export default authorDetails;