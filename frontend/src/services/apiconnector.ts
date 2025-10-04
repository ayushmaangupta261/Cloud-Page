import axios, { AxiosRequestConfig, Method } from "axios";

// Axios instance
export const axiosInstance = axios.create({
  withCredentials: true, // Allows cookies to be sent and received
});


export const apiConnector = <T = any>(
  method: Method,
  url: string,
  bodyData?: any,
  headers?: Record<string, string>,
  params?: Record<string, any>
): Promise<T> => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data: bodyData || null,
    headers: headers || {},
    params: params || {},
    withCredentials: true,
  };

  return axiosInstance(config).then((res) => res.data as T);
};
