import axios, { AxiosInstance } from 'axios';

export default class BaseClient {
    axios: AxiosInstance

    constructor(baseURL: string, API_TOKEN: string) {
        this.axios = axios.create({
            baseURL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            }
        })
    }
}