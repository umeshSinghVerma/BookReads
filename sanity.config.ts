import {defineConfig} from 'sanity';
import {deskTool } from 'sanity/desk';
import schemas from './sanity/schemas';
import {visionTool} from '@sanity/vision'
const config = defineConfig({
    projectId:'lnxjx1v5',
    dataset:"production",
    title:"Wittpad",
    apiVersion:"2023-10-27",
    basePath:'/admin',
    plugins:[deskTool(),visionTool()],
    schema:{types:schemas}
})

export default config;