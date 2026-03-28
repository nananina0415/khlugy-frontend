import { useCurrentUser, CenterRingLoadingIndicator } from "@khlug/common-module";
import { Box, Text, Badge, Stack, Flex } from "@chakra-ui/react";
import KhlugyLayout from "../../../layouts/KhlugyLayout";

// TODO: API로 교체
const MOCK_SUBMISSIONS = [
  {
    id: 1,
    serviceName: "피카츄배구",
    groupName: "게임 팀",
    createdAt: "2026-03-27",
    status: "pending",
    frontend: "request",
    backend: "none",
    subdomain: "pikachu-volleyball",
  },
];

const STATUS_LABEL: Record<string, string> = {
  pending: "검토 중",
  approved: "승인",
  rejected: "반려",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "yellow",
  approved: "green",
  rejected: "red",
};

export default function SubmissionsPage() {
  const { data: user, status } = useCurrentUser();

  if (status === "pending") {
    return <CenterRingLoadingIndicator />;
  }

  if (!user?.manager) {
    return (
      <KhlugyLayout>
        <Box textAlign="center" py="20">
          <Text color="gray.500">접근 권한이 없습니다.</Text>
        </Box>
      </KhlugyLayout>
    );
  }

  return (
    <KhlugyLayout>
      <Box border="1px solid" borderColor="gray.200" borderRadius="lg" p="16" bg="white">
        <Text fontSize="2xl" fontWeight="bold" mb="6">서비스 등록 신청 관리</Text>
        <Stack gap="3">
          {MOCK_SUBMISSIONS.map((s) => (
            <Box
              key={s.id}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              p="4"
              bg="gray.50"
            >
              <Flex justify="space-between" align="start">
                <Box>
                  <Flex align="center" gap="2" mb="1">
                    <Text fontWeight="semibold">{s.serviceName}</Text>
                    <Badge colorPalette={STATUS_COLOR[s.status]}>{STATUS_LABEL[s.status]}</Badge>
                  </Flex>
                  <Text fontSize="sm" color="gray.500">{s.groupName} · {s.createdAt}</Text>
                  <Flex gap="3" mt="2">
                    <Text fontSize="xs" color="gray.400">프런트: {s.frontend}</Text>
                    <Text fontSize="xs" color="gray.400">백엔드: {s.backend}</Text>
                    {s.subdomain && (
                      <Text fontSize="xs" color="gray.400">서브도메인: {s.subdomain}.khlugy.app</Text>
                    )}
                  </Flex>
                </Box>
              </Flex>
            </Box>
          ))}
          {MOCK_SUBMISSIONS.length === 0 && (
            <Text color="gray.400" textAlign="center" py="10">신청 내역이 없습니다.</Text>
          )}
        </Stack>
      </Box>
    </KhlugyLayout>
  );
}