import { apiClient } from "@khlug/common-module";

type SampleItem = {
  id: number;
  name: string;
};

export const SampleManageApi = {
  getList: () => apiClient.get<SampleItem[]>("/api/manage/sample"),
  deleteItem: (id: number) => apiClient.delete(`/api/manage/sample/${id}`),
};