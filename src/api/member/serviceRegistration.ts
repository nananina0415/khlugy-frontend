import { apiClient } from "@khlug/common-module";

type HostingOption = "none" | "self" | "request";

type HostingInfo = {
  option: HostingOption;
  url: string;
  repo: string;
};

type SubdomainInfo = {
  requested: boolean;
  name: string;
};

export type SubmitServiceRegistrationRequest = {
  serviceName: string;
  description: string;
  groupId: number;
  category: string;
  memberIds: number[];
  externalCreators: string[];
  frontend: HostingInfo;
  backend: HostingInfo;
  subdomain: SubdomainInfo;
};

export const ServiceRegistrationApi = {
  checkServiceName: (serviceName: string) =>
    apiClient.post<{ available: boolean }>("/khlugy/service-submission/check/service-name", { serviceName }),
  checkSubdomain: (subdomain: string) =>
    apiClient.post<{ available: boolean }>("/khlugy/service-submission/check/subdomain", { subdomain }),
  submitServiceRegistration: (body: SubmitServiceRegistrationRequest) =>
    apiClient.post("/khlugy/service-submission", body),
};