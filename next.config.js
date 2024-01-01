/** @type {import('next').NextConfig} */
const dotenv = require('dotenv');
dotenv.config();
const nextConfig = {
    images:{
        domains:["biblioreads.eu.org","images.blinkist.io","businessblog.blinkist.com",'cdn.sanity.io']
    },
    reactStrictMode: false
}
module.exports = nextConfig
