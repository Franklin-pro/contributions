import { defineStore } from 'pinia'
import { useAuthStore, useAlertStore } from '~/stores' // assumes auth store exists

export const useSeasonsStore = defineStore("seasonsStore", () => {
    const loading = ref(false);
    const seasons = ref<any[]>([]);
    const selectedSeason = useCookie<any>("selected-season", {
        maxAge: 60 * 60,
        sameSite: "strict",
        httpOnly: false,
    });

    const alert = useAlertStore();
    const auth = useAuthStore();
    const config = useRuntimeConfig();
    const baseUrl = config.public.baseUrl;

    const setSeasons = (data: any) => (seasons.value = data);
    const setLoading = (value: boolean) => (loading.value = value);
    const setSelectedSeason = (value: any) => (selectedSeason.value = value);

    const getHeaders = () => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (auth.isLoggedIn && auth.token) {
            headers['Authorization'] = `${auth.token}`;
        }
        return headers;
    };

    const getSeasons = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/seasons`, {
                headers: getHeaders()
            });
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            setSeasons(data.data);
        } catch (error) {
            console.error("Failed to fetch seasons:", error);
        } finally {
            setLoading(false);
        }
    };

    const getSeasonById = async (id: number | string) => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/seasons/${id}`, {
                headers: getHeaders()
            });
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            setSelectedSeason(data.data);
        } catch (error) {
            console.error("Failed to fetch season by ID:", error);
        } finally {
            setLoading(false);
        }
    };

    const addSeason = async (payload: any) => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/seasons`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const result = await res.json();
            alert.success(result.message);
            navigateTo('/dashboard/seasons');
        } catch (error) {
            console.error("Failed to add season:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateSeason = async (payload: any) => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/seasons/${payload.id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const result = await res.json();
            alert.success(result.message);
            await getSeasons();
        } catch (error) {
            console.error("Failed to update season:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteSeason = async (id: number | string) => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/seasons/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const result = await res.json();
            alert.success(result.message);
            await getSeasons();
        } catch (error) {
            console.error("Failed to delete season:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        seasons,
        selectedSeason,
        setSeasons,
        setLoading,
        setSelectedSeason,
        getSeasons,
        getSeasonById,
        addSeason,
        updateSeason,
        deleteSeason,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSeasonsStore, import.meta.hot));
}
