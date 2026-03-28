import {
  useCurrentUser,
  CenterRingLoadingIndicator,
} from "@khlug/common-module";
import { Box, Text } from "@chakra-ui/react";
import KhlugyLayout from "../../../layouts/KhlugyLayout";
import SubmitForm from "../../../features/submit/SubmitForm";

export default function SubmitPage() {
  const { data: user, status } = useCurrentUser();

  if (status === "pending") {
    return <CenterRingLoadingIndicator />;
  }

  if (!user?.id) {
    return (
      <KhlugyLayout>
        <Box textAlign="center" py="20">
          <Text color="gray.500">로그인이 필요합니다.</Text>
        </Box>
      </KhlugyLayout>
    );
  }

  return (
    <KhlugyLayout>
      <div style={{ padding: "32px" }}>
        <Box
          border="1px solid"
          borderColor="gray.200"
          borderRadius="lg"
          p="16"
          bg="white"
        >
          <SubmitForm />
        </Box>
      </div>
    </KhlugyLayout>
  );
}