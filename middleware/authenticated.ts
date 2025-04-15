export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();
    if (!!authStore.token) {
        return await navigateTo(`/dashboard`);
    }
});