// schemas/book.js
const book = {
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name:'slug',
      title:"Slug",
      type:'string'
    },
    {
      name: 'book_image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true // <-- Defaults to false
      }
    },
    {
      name: 'imgUrl',
      title: 'Image url',
      type: 'url'
    },
    // {
    //   name: 'book_author',
    //   title: 'Author',
    //   type: 'array',
    //   of: [{
    //     name: 'authors',
    //     title: "Author",
    //     type: 'reference',
    //     to: [{ type: 'authorDetails' }]
    //   }]
    // },
    {
      name: 'book_AllAuthors',
      title: 'Authors',
      type: 'array',
      of: [{
        name:'book_authorName',
        type:'object',
        title:'Author',
        fields:[
          {name:'id',type:'number',title:'Id'},
          {name:'name',type:'string',title:'Author Name'},
          {name:'url',type:'string',title:'Url'},
          {name:'desc',type:'string',title:'About Author'}
        ]
      }]
    },
    {
      name: 'book_tagline',
      title: 'Tagline',
      type: 'string'
    },
    {
      name: 'book_timeToRead',
      title: 'Time To Read',
      type: 'number'
    },
    {
      name: 'about',
      title: 'About',
      type: 'string'
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule:any) => Rule.unique()
    },
    {
      name: 'book_topic',
      title: 'Topic',
      type: 'array',
      of: [{ type: 'string' }]
    },
    {
      name: 'book_bestQuote',
      title: 'Best Quote',
      type: 'string',
    },
    {
      name: 'book_whoShouldRead',
      title: 'Who Should Read It?',
      type: 'array',
      of: [{ type: "string" }]
    },
    {
      name: 'book_buyLink',
      title: 'Buy Link',
      type: 'url',
    },
    {
      name:'book_rating',
      title:'Rating',
      type:'string'
    },
    {
      name: 'book_ratingsReceived',
      title: 'Ratings Received',
      type: 'array',
      of: [
        {
          name: 'book_ratingByUser',
          type: 'object',
          title: 'Rating',
          fields: [
            { name: 'user_email', type: 'email', title: 'Email' },
            { name: 'starRating', type: 'number', title: 'Rating' }
          ]
        }
      ]
    },
    {
      name: 'wholeSummary',
      title: 'Summary',
      type: 'string'
    }
  ]
}


export default book;

