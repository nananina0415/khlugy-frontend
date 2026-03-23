import { apiClient } from "@khlug/common-module";

type SampleItem = {
  id: number;
  name: string;
};

export const SamplePublicApi = {
  getItem: (id: number) => apiClient.get<SampleItem>(`/api/public/sample/${id}`),
};