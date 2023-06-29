export type BaseClientAttributes = {
    base_url: string
    headers?: Record<string, string>
};

export abstract class BaseClient {
    headers: Record<string, string>
    base_url: string

    constructor({ base_url, headers = {} }: BaseClientAttributes) {
        this.base_url = base_url
        this.headers = headers
    }

    async request<T>({ input, init }: FetchOptions): Promise<T> {
        const url = `${this.base_url}${input}`
        const headers = this.headers
        const config = {
            ...init,
            headers,
        };

        const response = await fetch(url, config)
        return response.json()
    }

    static wrap(f: Function): Function {
        f = f.bind(this)
        // @ts-ignore
        BaseClient.prototype[f.name] = async function (...args: any[]) {
            return await this.request(f(args))
        }
        return f
    }
}

export abstract class Client extends BaseClient {
    constructor({ base_url, headers = {}, endpoints }: BaseClientAttributes & { endpoints: Record<string, FetchOptionsResolver> }) {
        super({ base_url, headers })

        for (const name of Object.keys(endpoints)) {
            const fetch_options_resolver = endpoints[name]
            // @ts-ignore
            this[name] = async function (...args: any[]) {
                return await this.request(fetch_options_resolver(args))
            }
        }
    }
}

// @ts-ignore
export function CreateClient(endpoints: Record<string, FetchOptionsResolver>) {
    class _Client extends BaseClient { }

    for (const action of Object.keys(endpoints)) {
        const fetch_options_resolver = endpoints[action]
        // @ts-ignore
        _Client.prototype[action] = async function (...args: any[]) {
            return await this.request(fetch_options_resolver(args))
        }
    }

    return _Client
}



export interface FetchOptions {
    input: string
    init?: RequestInit
}

export interface FetchOptionsResolver {
    <T>(args: T): FetchOptions
}

export interface RequestInitResolver {
    <T>(args: T): RequestInit
}

export interface EndpointAction {
    <T>(args: EndpointActionParams): FetchOptionsResolver
}

export interface EndpointActionParams {
    f: RequestInitResolver
    method: string
    endpoint: string
}

// export function action<T>({ f, method, endpoint }: EndpointActionParams<T>): FetchOptionsResolver<T> {
//     return function resolver<T>(args: T): FetchOptions {
//         let request_init = f(args)
//         request_init.method = method

//         return {
//             input: endpoint,
//             init: request_init,
//         }
//     }
// }

// interface FetchClientActionBuilder {
//     <T>(method: string, endpoint: string):
//         (f: RequestInitResolver<T>) => FetchOptionsResolver<T>
// }


export function action<T>(method: string, endpoint: string) {
    return function decorator(f: RequestInitResolver): FetchOptionsResolver {
        return function <T>(args: T): FetchOptions {
            const request_init = f(args);
            request_init.method = method

            return {
                input: endpoint,
                init: request_init,
            }
        }
    }
}

// class _Function extends Function {
//     // @ts-ignore
//     constructor(f: Function) {
//         return Object.setPrototypeOf(f, new.target.prototype);
//     }
// }

// export class Action<T> extends _Function {
//     constructor(method: string, endpoint: string) {
//         super(
//             function action(params: T): FetchOptions {
//                 let request_init = f(params)
//                 request_init.method = method

//                 return {
//                     input: endpoint,
//                     init: request_init,
//                 }
//             }
//         )
//     }
// }


