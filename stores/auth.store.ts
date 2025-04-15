// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

interface LoginResponse {
  status: number;
  success: boolean;
  message: string;
  token: string;
  data: User;
}

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie("token", {
    maxAge: 60 * 60,
    sameSite: "strict",
    httpOnly: false,
  }); const loading = ref<boolean>(false)
  const user = useCookie<any>("user", {
    maxAge: 60 * 60,
    sameSite: "strict",
    httpOnly: false,
  });
  const config = useRuntimeConfig();
  const baseUrl = config.public.baseUrl;

  const setUser = (userData?: User) => (user.value = userData)
  const setLoading = (data: boolean) => (loading.value = data)
  const setToken = (data?: string) => (token.value = data)
  const router = useRouter() // Get router instance
  const isLoggedIn = computed(() => !!token.value)

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      token.value = savedToken
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        console.error('Failed to parse saved user data', e)
        localStorage.removeItem('user')
      }
    }
  }

  const login = async (credentials: any) => {
    setLoading(true);

    try {
      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (response.ok && responseData?.success) {
        // Destructure the response for clarity
        const { token, data, message } = responseData;

        // Store auth data
        setToken(token);
        setUser(data);

        // Use try/catch for localStorage to handle private browsing mode issues
        try {
          // Store data in localStorage with expiration
          const expiresAt = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours

          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(data));
          localStorage.setItem('expiresAt', expiresAt.toString());

          // Optionally set up token refresh logic
          setupTokenRefreshTimer(expiresAt);
        } catch (storageError) {
          console.warn('Unable to access localStorage:', storageError);
          // Continue with in-memory authentication only
        }
        navigateTo('/dashboard');
        return {
          success: true,
          message: message || 'Login successful',
          data
        };
      } else {
        return {
          success: false,
          message: responseData?.message || 'Invalid credentials or server error',
          code: responseData?.code || 'UNKNOWN_ERROR'
        };
      }
    } catch (error: any) {
      // More detailed error categorization
      let errorMessage = 'An error occurred during login';
      let errorCode = 'UNKNOWN_ERROR';

      if (error.name === 'AbortError') {
        errorMessage = 'Login request timed out. Please try again.';
        errorCode = 'TIMEOUT_ERROR';
      } else if (error instanceof TypeError && error.message.includes('NetworkError')) {
        // Network error
        errorMessage = 'No response from server. Please check your connection.';
        errorCode = 'NETWORK_ERROR';
      }

      console.error('Login error:', { message: errorMessage, code: errorCode, details: error });

      return {
        success: false,
        message: errorMessage,
        code: errorCode
      };
    } finally {
      setLoading(false);
    }
  };

  // Helper function to set up token refresh
  const setupTokenRefreshTimer = (expiresAt: number) => {
    const refreshTime = expiresAt - (30 * 60 * 1000); // Refresh 30 minutes before expiry
    const timeUntilRefresh = refreshTime - new Date().getTime();

    if (timeUntilRefresh > 0) {
      setTimeout(() => {
        // Implement your token refresh logic here
        refreshToken();
      }, timeUntilRefresh);
    }
  };

  // Token refresh function
  const refreshToken = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return;

      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: currentToken })
      });

      const responseData = await response.json();

      if (response.ok && responseData?.success) {
        setToken(responseData.token);
        localStorage.setItem('token', responseData.token);

        const expiresAt = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('expiresAt', expiresAt.toString());

        setupTokenRefreshTimer(expiresAt);
      } else {
        // Token refresh failed, redirect to login
        logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  // Logout handler
  const logout = () => {
    setToken();
    setUser();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('expiresAt');
    // Redirect to login page
    window.location.href = '/auth';
  };

  return {
    token,
    user,
    isLoggedIn,
    login,
    logout,
    setUser,
    setLoading,
    setToken,
    loading,
    initializeAuth
  }
})