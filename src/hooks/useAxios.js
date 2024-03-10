import axios from 'axios'

const useAxios = () => {
    const instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL
    })

    instance.defaults.headers.common['Accept'] = 'application/json'
    instance.defaults.headers.common['Content-Type'] = 'application/json'

    instance.interceptors.request.use(
        (config) => {
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    instance.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    return instance
}

export default useAxios