// schemas/category.js
const category =  {
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Category Name',
        type: 'string',
      },
      {
        name: 'topics',
        title: 'Topics',
        type: 'array',
        of: [{ type: 'string' }],
        validation: (Rule:any) => Rule.unique().warning()
      },
    ],
  };
  export default category;
  