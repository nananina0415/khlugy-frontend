import { useQuery } from "@tanstack/react-query";
import { UserPublicApi, GroupMemberApi } from "@khlug/common-module";

export const useMyGroups = () => {
  return useQuery({
    queryKey: ["my-groups"],
    queryFn: () => UserPublicApi.getMyGroups(true),
  });
};

export const useGroupMembers = (groupId: string) => {
  return useQuery({
    queryKey: ["group-members", groupId],
    queryFn: () => GroupMemberApi.getGroupMembers(groupId),
    enabled: !!groupId,
  });
};