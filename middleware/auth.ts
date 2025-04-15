// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()
    if (!auth.isLoggedIn) {
        return navigateTo('/auth')
    }
})
