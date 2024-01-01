// sanity.js
import { createClient } from '@sanity/client'
// Import using ESM URL imports in environments that supports it:
// import {createClient} from 'https://esm.sh/@sanity/client'

const client = createClient({
  projectId: 'lnxjx1v5',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2023-10-27', // use current date (YYYY-MM-DD) to target the latest API version
  token: 'skNlEmQzXgxtdKsDoNDmnr12p2WG7ihfBAWPNY1Y2Ah6PRzYdBVcWqVrU8WhdrGMcudKSVpRpJFE7yxwl0zUITMlGonFMAvungpPej71QyHhNlrZWd1jVFUMLbPTEzhtZfZkGd0LciHnUbtXopfoVP9q8tuKxIxDCvTtM921DXiBmgKqQboU'
})

export default client;