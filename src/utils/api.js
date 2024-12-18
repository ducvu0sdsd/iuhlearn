import axios from "axios";
export let baseURL = 'http://localhost:8080/api/v1'
axios.defaults.baseURL = `${baseURL}`

export const TypeHTTP = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
}

export const api = ({ path, body, type, sendToken = false, port }) => {
    if (port) {
        baseURL = 'http://localhost:' + port + '/api/v1'
        axios.defaults.baseURL = `${baseURL}`
    } else {
        // baseURL = 'http://localhost:8080/api/v1'
        baseURL = 'https://iuh-learn-be-beige.vercel.app/api/v1'
        axios.defaults.baseURL = `${baseURL}`
    }
    const accessToken = globalThis.localStorage.getItem('accessToken')
    const refreshToken = globalThis.localStorage.getItem('refreshToken')
    return new Promise((rejects, resolve) => {
        switch (type) {
            case TypeHTTP.GET:
                axios.get(path, { headers: sendToken ? { accessToken, refreshToken } : {} })
                    .then(res => {
                        if (sendToken) {
                            globalThis.localStorage.setItem('accessToken', res.data.tokens.accessToken)
                            globalThis.localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
                            rejects(res.data.data)
                        } else {
                            rejects(res.data)
                        }
                    })
                    .catch(res => {
                        resolve({ status: res.response?.status, message: res.response?.data })
                    })
                break
            case TypeHTTP.POST:
                axios.post(path, body, { headers: sendToken ? { accessToken, refreshToken } : {} })
                    .then(res => {
                        if (sendToken) {
                            globalThis.localStorage.setItem('accessToken', res.data.tokens.accessToken)
                            globalThis.localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
                            rejects(res.data.data)
                        } else {
                            rejects(res.data)
                        }
                    })
                    .catch(res => {
                        resolve({ status: res.response?.status, message: res.response?.data })
                    })
                break
            case TypeHTTP.PUT:
                axios.put(path, body, { headers: sendToken ? { accessToken, refreshToken } : {} })
                    .then(res => {
                        if (sendToken) {
                            globalThis.localStorage.setItem('accessToken', res.data.tokens.accessToken)
                            globalThis.localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
                            rejects(res.data.data)
                        } else {
                            rejects(res.data)
                        }
                    })
                    .catch(res => {
                        resolve({ status: res.response?.status, message: res.response?.data })
                    })
                break
            case TypeHTTP.DELETE:
                axios.delete(path, { headers: sendToken ? { accessToken, refreshToken } : {} })
                    .then(res => {
                        if (sendToken) {
                            globalThis.localStorage.setItem('accessToken', res.data.tokens.accessToken)
                            globalThis.localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
                            rejects(res.data.data)
                        } else {
                            rejects(res.data)
                        }
                    })
                    .catch(res => {
                        resolve({ status: res.response?.status, message: res.response?.data })
                    })
                break
        }
    })
}