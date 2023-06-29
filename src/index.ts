import {
    Configuration,
    CollectionsApi,
    RaindropsApi,
} from "./sdk"


export default class SDK {
    collections: CollectionsApi
    raindrops: RaindropsApi

    constructor(API_TOKEN: string) {
        function initApi(ApiClass: any) {
            return new ApiClass(
                new Configuration({
                    baseOptions: {
                        headers: {
                            Authorization: `Bearer ${API_TOKEN}`
                        }
                    }
                }),
                'https://api.raindrop.io/rest/v1',
            )
        }

        this.collections = initApi(CollectionsApi)
        this.raindrops = initApi(RaindropsApi)
    }
}


// import BaseClient from './client';


// export default class RaindropSDK extends BaseClient {
//     constructor(API_TOKEN: string) {
//         super('https://api.raindrop.io/rest/v1', API_TOKEN)
//     }

//     async collections() {
//         const response = await this.axios.get('/collections', {})
//         return response.data
//     }

//     async collection(id: number) {
//         const response = await this.axios.get(`/ collection / ${ id }`, {})
//         return response.data
//     }

//     async collections_childrens() {
//         const response = await this.axios.get(`/ collections / childrens`, {})
//         return response.data
//     }

//     async raindrop(id: number) {
//         const response = await this.axios.get(`/ raindrop / ${ id }`, {})
//         return response.data
//     }
// }
