    // lib/api.ts
    export const apiFetch = async (path: string, options: RequestInit = {}) => {
    return fetch(path, options); // relative URL
    };
