import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { KhlugIcon, useCurrentUser } from "@khlug/common-module";

export default function HeroBanner() {
  const { data: user } = useCurrentUser();
  const isInternal = !!user;

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      p="16"
      bg="white"
    >
      <Flex direction="column" align="center" gap="10">
        <Flex direction="column" align="center" gap="4">
          <Image src="/khulugy_logo.png" alt="쿠러기 로고" h="16" />
          <Text fontWeight="semibold" fontSize="2xl">
            쿠러기가 만든 꾸러기 앱 꾸러미
          </Text>
          <Text fontSize="lg" color="gray.500">
            {isInternal
              ? "우리들의 코딩이 서비스가 되는 공간"
              : "경희대학교 중앙 IT 동아리 쿠러그의 공개 서비스 모음"}
          </Text>
        </Flex>

        <Box textAlign="center" lineHeight="tall">
          <Text fontSize="lg" fontWeight="medium" color="gray.600" mb="1">
            쿠러기 = 쿠러그 + 꾸러기
          </Text>
          <Text fontSize="sm" color="gray.400">
            호기심 가득, 도전을 두려워하지 않는 IT 새내기
          </Text>
        </Box>

        <Box textAlign="center" color="gray.600" lineHeight="tall" maxW="600px">
          <Text mb="3" textAlign="left">
            이곳은 경희대학교 중앙 IT 동아리 쿠러그 부원, 쿠러기들이 직접
            기획하고 개발한 서비스를 공개하는 사이트입니다. 각 서비스는
            쿠러기들의 아이디어와 코딩으로 만들어졌으며, 누구나 자유롭게 이용할
            수 있습니다.
          </Text>
          <br />
          <Text mb="6">원하는 서비스를 선택해 바로 이용해보세요.</Text>
          <a href="https://khlug.org" target="_blank" rel="noreferrer">
            <Flex
              display="inline-flex"
              align="center"
              gap="2"
              px="4"
              py="2"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="full"
              color="gray.700"
              fontSize="sm"
              fontWeight="medium"
              _hover={{ borderColor: "blue.400", color: "blue.500" }}
            >
              <KhlugIcon />
              경희대학교 중앙 IT 동아리 쿠러그
            </Flex>
          </a>
        </Box>
      </Flex>
    </Box>
  );
}
