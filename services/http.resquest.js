import { useAuthStore } from "@/stores";
import { showError } from '#app';
export const httpRequest = {
    get: request("GET"),
    post: request("POST"),
    put: request("PUT"),
    delete: request("DELETE"),
};
function request(method) {
    return (url, body, multipart = false) => {
        const requestOptions = {
            method,
            headers: authHeader(url),
            // credentials: 'include'
        };
        const config = useRuntimeConfig();
        const baseUrl = config.public.baseUrl;

        if (body && !multipart) {
            requestOptions.headers["Content-Type"] = "application/json";
            requestOptions.body = JSON.stringify(body);
        }
        if (body && multipart) {
            requestOptions.body = body;
        }
        return useFetch(baseUrl + url, requestOptions).then(handleResponse, url);
        // return fetch('/api' + url, requestOptions).then(handleResponse, url);
    };
}
// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const { user, token } = useAuthStore();
    const isLoggedIn = token != "" && token != undefined;

    // const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);

    const headers = {
        'Accept-Language': 'en',
        'Host': "192.168.1.77"
    };

    if (isLoggedIn) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
}

async function handleResponse(response, url) {
    const alertStore = useAlertStore();
    const isJson = response.headers
        ?.get("content-type")
        ?.includes("application/json");
    const data = isJson && response.status !== 204 ? await response.json() : null;

    // check for error response
    if (response?.status === 204) {
        return Promise.resolve({ status: 204, message: "No Content" });
    } else if (!response.ok) {
        const { user, token, setToken, setUser
        } = useAuthStore();
        if ([401, 403].includes(response.status) && user) {
            // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            const isLoggedIn = token != "" && token != undefined;
            if (isLoggedIn) {
                try {
                    // logout();
                    setToken()
                    setUser()
                } catch (e) {
                    setToken()
                    setUser()

                }
            } else {
                navigateTo("/login", { replace: true });
            }

        } else if (response?.status === 404) {
            // Trigger Nuxt error handling
            // Trigger Nuxt error handling
            const message = data?.message ?? 'Entity not found'
            // showError({
            //   statusCode: 404,
            //   message
            // });
        } else if (response?.status === 405) {
            return Promise.reject(...data);
        }
        // alertStore.error(data?.message);
        // get error message from body or default to response status
        // const error = (data && data.message) || response.status;
        return Promise.reject({
            ...data
        });
    }

    return data;
}
