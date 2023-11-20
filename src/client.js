import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const env = import.meta.env

export const client = createClient({
    projectId: env.VITE_REACT_APP_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2022-03-25',
    useCdn: true,
    token: env.VITE_REACT_APP_SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)