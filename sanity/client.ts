// sanity.js
import { createClient } from '@sanity/client'
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

const client = createClient({
  projectId: '2ll625mq',
  dataset: 'production',
  useCdn: false, // set to `false` to bypass the edge cache
  apiVersion: '2023-10-27', // use current date (YYYY-MM-DD) to target the latest API version
  token: 'skR9ZfRRRzost85HgW3k0v4HqpDjY7XKhDlkTfesbI1wKrXpK9X2NhttyNu2X39dkPARWE9NPAvnqvQddzcJDd0fyeGkuayQ8ayfgDAbfwxYiMwe20064kMOABrhXeU722dJJUwo9bgbguXxyE7TUsxx2gADDsfy9PxBeKuE3UVTaWF9Gupc'
})

export default client;