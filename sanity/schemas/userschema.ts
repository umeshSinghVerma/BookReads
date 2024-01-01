const user = {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
      {
        name: 'user_email',
        title: 'Email',
        type: 'email'
      },
      {
        name:'user_savedBooks',
        title:'Saved Books',
        type:'array',
        of:[{type:'book'}],
      }
      
    ]
  }
export default user;
