// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@pinia/nuxt", '@nuxtjs/color-mode' ,"@nuxtjs/google-fonts",, '@vueuse/motion/nuxt'],
  css: ["@/assets/css/main.css"],
 
  colorMode: {
    classSuffix: ''
  },
  googleFonts: {
    families: {
      'Poppins': [400, 500, 600, 700],
    },
    display: 'swap',
    prefetch: true,
  },

})