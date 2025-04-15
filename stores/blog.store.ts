import { defineStore } from 'pinia'
import { httpRequest } from "~/services";
import type { NewsTypes } from '~/types';
 
export const useBlogsStore = defineStore("blogsStore", () => {
  const loading = ref(false);
  const blogs = ref<any[]>([]);
  const selectedBlog = useCookie<any>("single-blog", {
    maxAge: 60 * 60,
    sameSite: "strict",
    httpOnly: false,
  });
  const alert = useAlertStore();
   const setBlogs = (data: any) => (blogs.value = data);
  const setLoading = (value: boolean) => (loading.value = value);
  const setSelectedBlog = (value: any) => (selectedBlog.value = value);
  const currentBlog = ref<NewsTypes>();
  const setCurrentBlog = (data: NewsTypes) => (currentBlog.value = data);
  const config = useRuntimeConfig();
  const baseUrl = config.public.baseUrl;

  const getBlogs = async (limit: number) => {
    setLoading(true);
    try {
      const response = await fetch(baseUrl + `/blogs?limit=${limit}`); // or full URL
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      // Optional: Add error handling here
      // setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  const addBlog = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(baseUrl + "/blogs", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      alert.success(result.message);
      navigateTo('/dashboard/news')
    } catch (error) {
      console.error("Failed to add blog:", error);
      // Optional: Error handling
      // alert.error("Failed to add blog");
    } finally {
      setLoading(false);
    }
  };

  const addGallery = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(baseUrl + "/galleries", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      alert.success(result.message);
      navigateTo('/dashboard/gallery')
    } catch (error) {
      console.error("Failed to add blog:", error);
      // Optional: Error handling
      // alert.error("Failed to add blog");
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/blogs/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      alert.success(result.message);
      getBlogs(200);
    } catch (error) {
      console.error("Failed to update blog:", error);
      // Optional: Error handling
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      alert.success(result.message);
      getBlogs(200);
    } catch (error) {
      console.error("Failed to delete blog:", error);
      // Optional: Error handling
    } finally {
      setLoading(false);
    }
  };

  const getOneBlog = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/blogs/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setSelectedBlog(result.data);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
      // Optional: Error handling
    } finally {
      setLoading(false);
    }
  };


  return {
    loading,
    blogs,
    getBlogs,
    setBlogs,
    setLoading,
    addBlog,
    updateBlog,
    deleteBlog,
    getOneBlog,
    selectedBlog,
    setSelectedBlog,
    currentBlog,
    setCurrentBlog,
    addGallery
  }
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBlogsStore, import.meta.hot));
}