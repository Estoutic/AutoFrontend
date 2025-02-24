import createHttpClient from "./apiClient";

import { AxiosInstance } from "axios";

export default class CustomClient<T> {
  client: AxiosInstance;
  methods: T;

  constructor(httpClient: AxiosInstance, methods: T) {
    this.client = httpClient;
    this.methods = methods;
  }

  getUrl(): string | undefined {
    return this.client.getUri();
  }

  changeClient(url: string, rawMethods: T) {
    this.client = createHttpClient(url);
    this.methods = rawMethods;
  }
}
