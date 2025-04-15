import { defineStore } from 'pinia'
import { useAuthStore, useAlertStore } from '~/stores'

export const useContributionsStore = defineStore("contributionsStore", () => {
  const loading = ref(false);
  const contributions = ref<any[]>([]);
  const selectedContribution = ref<any>(null);

  const alert = useAlertStore();
  const auth = useAuthStore();
  const config = useRuntimeConfig();
  const baseUrl = config.public.baseUrl;

  const setContributions = (data: any[]) => (contributions.value = data);
  const setSelectedContribution = (data: any) => (selectedContribution.value = data);
  const setLoading = (value: boolean) => (loading.value = value);

  const getHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (auth.isLoggedIn && auth.token) {
      headers['Authorization'] = `${auth.token}`;
    }
    return headers;
  };

  const getAllContributions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/contributions`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setContributions(data.data);
    } catch (error) {
      console.error("Failed to fetch contributions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getContributionsByMember = async (memberId: number | string, seasonId?: any) => {
    setLoading(true);
    try {
      var request;
      if(seasonId){
        request = `?seasonId=${seasonId}`
      }else{
        request = ``;
      }

      const res = await fetch(`${baseUrl}/api/contributions/member/${memberId}${request}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setContributions(data.data);
    } catch (error) {
      console.error("Failed to fetch contributions by member:", error);
    } finally {
      setLoading(false);
    }
  };
  const getContributionsBySeason = async (seasonId?: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/contributions/season/${seasonId}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setContributions(data.data);
    } catch (error) {
      console.error("Failed to fetch contributions by member:", error);
    } finally {
      setLoading(false);
    }
  };

  

  const getContributionById = async (id: number | string) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/contributions/${id}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setSelectedContribution(data.data);
    } catch (error) {
      console.error("Failed to fetch contribution by ID:", error);
    } finally {
      setLoading(false);
    }
  };

  const addContribution = async (payload: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/contributions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const result = await res.json();
      alert.success(result.message);
      await getAllContributions();
    } catch (error) {
      console.error("Failed to add contribution:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateContribution = async (payload: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/contributions/${payload.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const result = await res.json();
      alert.success(result.message);
      await getAllContributions();
    } catch (error) {
      console.error("Failed to update contribution:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteContribution = async (id: number | string) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/contributions/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const result = await res.json();
      alert.success(result.message);
      await getAllContributions();
    } catch (error) {
      console.error("Failed to delete contribution:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    contributions,
    selectedContribution,
    setContributions,
    setSelectedContribution,
    setLoading,
    getAllContributions,
    getContributionsByMember,
    getContributionById,
    addContribution,
    updateContribution,
    deleteContribution,
    getContributionsBySeason,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useContributionsStore, import.meta.hot));
}
