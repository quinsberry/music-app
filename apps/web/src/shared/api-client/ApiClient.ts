const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ResponseErrorConfig {
    message: string;
    statusCode: number;
    statusText: string;
}

export class ResponseError extends Error {
    statusCode: number;
    statusText: string;

    constructor(config: ResponseErrorConfig) {
        super(config.message);
        this.statusCode = config.statusCode;
        this.statusText = config.statusText;
    }
}

type RequestOptions = {
    headers?: HeadersInit;
    params?: Record<string, string>;
    body?: unknown;
};

const handleResponse = async <T = unknown>(response: Response): Promise<T> => {
    switch (true) {
        case response.status === 204:
            return null as T;
        case response.status === 200 || response.status === 201:
            return response.json();
        default:
            let error: ResponseError | undefined;
            try {
                const serverError = await response.json();
                console.log(serverError);
                error = new ResponseError({
                    message: 'message' in serverError ? serverError.message : serverError.error,
                    statusCode: response.status,
                    statusText: response.statusText,
                });
            } catch (e) {
                console.log(e);
                error = new ResponseError({
                    message: `Could not parse response body`,
                    statusCode: response.status,
                    statusText: response.statusText,
                });
            }
            throw error;
    }
};

export class ApiClient {
    private static async request<T>(endpoint: string, method: string, options: RequestOptions = {}): Promise<T> {
        const { headers = {}, params, body } = options;

        const url = new URL(`${BASE_API_URL}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        return fetch(url.toString(), {
            method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        }).then((res) => handleResponse(res));
    }

    static async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'GET', options);
    }

    static async post<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'POST', options);
    }

    static async put<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'PUT', options);
    }

    static async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, 'DELETE', options);
    }
}
