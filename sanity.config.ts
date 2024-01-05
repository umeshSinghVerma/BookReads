import {defineConfig} from 'sanity';
import {deskTool } from 'sanity/desk';
import schemas from './sanity/schemas';
import {visionTool} from '@sanity/vision'
const config = defineConfig({
    projectId:'2ll625mq',
    dataset:"production",
    title:"All Books",
    apiVersion:"2023-10-27",
    basePath:'/admin',
    plugins:[deskTool(),visionTool()],
    schema:{types:schemas}
})

export default config;