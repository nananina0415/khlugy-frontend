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
  groupId: string;
  category: string;
  memberIds: number[];
  externalCreators: string[];
  frontend: HostingInfo;
  backend: HostingInfo;
  subdomain: SubdomainInfo;
};

export const ServiceRegistrationApi = {
  checkServiceName: (serviceName: string) =>
    apiClient.post<{ available: boolean }>("/khlugy/service-registration/check/service-name", { serviceName }),
  checkSubdomain: (subdomain: string) =>
    apiClient.post<{ available: boolean }>("/khlugy/service-registration/check/subdomain", { subdomain }),
  submitServiceRegistration: (body: SubmitServiceRegistrationRequest) =>
    apiClient.post("/khlugy/service-registration", body),
};