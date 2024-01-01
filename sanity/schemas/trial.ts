const trial = {
    name: 'trial',
    type: 'document',
    title: 'Trial',
    fields: [
        {
            name: 'trial1',
            title: 'Trial 2',
            type: 'string'
        },
        {
            name: "arraytrial",
            title: 'Array Trial',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'bookname', title: "Book name", type: 'string' },
                    { name: 'bookname2', title: "Book name2", type: 'string' },
                ]
            }]
        },
        {
            name: "objtrial",
            title: 'Object Trial',
            type: 'array',
            of: [{
                name: 'other',
                title: 'this is alpha',
                type: 'reference',
                to: [{ type: 'trial2' }]
            }]
        },
        {
            name: 'other',
            title: 'this is alpha',
            type: 'reference',
            to: [{ type: 'trial2' }]
        }
    ]
}
export default trial;