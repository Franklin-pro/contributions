import { defineStore } from 'pinia'
import { useAuthStore, useAlertStore } from '~/stores'

export const useMembersStore = defineStore("membersStore", () => {
  const loading = ref(false);
  const members = ref<any[]>([]);
  const selectedMember = ref<any>(null);

  const alert = useAlertStore();
  const auth = useAuthStore();
  const config = useRuntimeConfig();
  const baseUrl = config.public.baseUrl;

  const setMembers = (data: any[]) => (members.value = data);
  const setLoading = (value: boolean) => (loading.value = value);
  const setSelectedMember = (value: any) => (selectedMember.value = value);

  const getHeaders = () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (auth.isLoggedIn && auth.token) {
      headers['Authorization'] = `${auth.token}`;
    }
    return headers;
  };

  const getAllMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/members`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setMembers(data.data);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMembersByOrganization = async (orgId: number | string) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/organizations/${orgId}/members`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setMembers(data.data);
    } catch (error) {
      console.error("Failed to fetch members by organization:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMemberById = async (id: number | string) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/members/${id}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setSelectedMember(data.data);
    } catch (error) {
      console.error("Failed to fetch member by ID:", error);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (payload: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/members`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const result = await res.json();
      alert.success(result.message);
      await getAllMembers();
    } catch (error) {
      console.error("Failed to add member:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (payload: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/members/${payload.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const result = await res.json();
      alert.success(result.message);
      await getAllMembers();
    } catch (error) {
      console.error("Failed to update member:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id: number | string) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/members/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const result = await res.json();
      alert.success(result.message);
      await getAllMembers();
    } catch (error) {
      console.error("Failed to delete member:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    members,
    selectedMember,
    setMembers,
    setSelectedMember,
    setLoading,
    getAllMembers,
    getMembersByOrganization,
    getMemberById,
    addMember,
    updateMember,
    deleteMember
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMembersStore, import.meta.hot));
}
