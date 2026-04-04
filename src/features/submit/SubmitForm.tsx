import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useMyGroups, useGroupMembers } from "./useSubmitGroups";
import { ServiceRegistrationApi } from "../../api/member/serviceRegistration";
import { SERVICE_CATEGORIES } from "./serviceCategories";
import ReactMarkdown from "react-markdown";
import { Prose } from "../../components/ui/prose";
import {
  Box,
  Flex,
  Text,
  Input,
  Textarea,
  Button,
  Stack,
  Checkbox,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";

const categoryCollection = createListCollection({
  items: SERVICE_CATEGORIES.map((c) => ({ label: c, value: c })),
});

type HostingOption = "none" | "self" | "request";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text fontWeight="semibold" fontSize="md" color="gray.700" mb="3">
      {children}
    </Text>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <Text fontSize="md" fontWeight="medium" color="gray.600" mb="1.5">
      {children}
      {required && (
        <Text as="span" color="red.400" ml="1">
          *
        </Text>
      )}
    </Text>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      px="3"
      py="1.5"
      border="1px solid"
      borderColor={selected ? "blue.400" : "gray.200"}
      borderRadius="md"
      cursor="pointer"
      bg={selected ? "blue.50" : "white"}
      color={selected ? "blue.600" : "gray.600"}
      fontSize="sm"
      onClick={onClick}
      _hover={{ borderColor: "blue.300" }}
    >
      {label}
    </Box>
  );
}

function HostingSection({
  id,
  label,
  option,
  onChange,
  urlValue,
  onUrlChange,
  repoValue,
  onRepoChange,
  urlPlaceholder,
  selfHint,
  requestHint,
  urlError,
  repoError,
}: {
  id?: string;
  label: string;
  option: HostingOption;
  onChange: (v: HostingOption) => void;
  urlValue: string;
  onUrlChange: (v: string) => void;
  repoValue: string;
  onRepoChange: (v: string) => void;
  urlPlaceholder: string;
  selfHint?: string;
  requestHint?: string;
  urlError?: string;
  repoError?: string;
}) {
  return (
    <Box id={id}>
      <FieldLabel>{label}</FieldLabel>
      <Flex gap="2" mb="2">
        <OptionButton
          label="없음"
          selected={option === "none"}
          onClick={() => onChange("none")}
        />
        <OptionButton
          label="자체 호스팅"
          selected={option === "self"}
          onClick={() => onChange("self")}
        />
        <OptionButton
          label="호스팅 신청"
          selected={option === "request"}
          onClick={() => onChange("request")}
        />
      </Flex>
      {option === "self" && (
        <Box>
          <Input
            size="sm"
            placeholder={urlPlaceholder}
            value={urlValue}
            onChange={(e) => onUrlChange(e.target.value)}
          />
          {urlError ? (
            <Text fontSize="xs" color="red.400" mt="1">
              {urlError}
            </Text>
          ) : (
            selfHint && (
              <Text fontSize="xs" color="gray.400" mt="1">
                {selfHint}
              </Text>
            )
          )}
        </Box>
      )}
      {option === "request" && (
        <Box>
          <Input
            size="sm"
            placeholder="https://github.com/username/repo"
            value={repoValue}
            onChange={(e) => onRepoChange(e.target.value)}
          />
          {repoError ? (
            <Text fontSize="xs" color="red.400" mt="1">
              {repoError}
            </Text>
          ) : (
            requestHint && (
              <Text fontSize="xs" color="gray.400" mt="1">
                {requestHint}
              </Text>
            )
          )}
        </Box>
      )}
    </Box>
  );
}

export default function SubmitForm() {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [groupId, setGroupId] = useState("");
  const [category, setCategory] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [externalCreators, setExternalCreators] = useState<string[]>([]);
  const [externalInput, setExternalInput] = useState("");
  const [frontend, setFrontend] = useState<{
    option: HostingOption;
    url: string;
    repo: string;
  }>({ option: "none", url: "", repo: "" });
  const [backend, setBackend] = useState<{
    option: HostingOption;
    url: string;
    repo: string;
  }>({ option: "none", url: "", repo: "" });
  const [subdomain, setSubdomain] = useState<{
    requested: boolean;
    name: string;
  }>({ requested: false, name: "" });
  const [errors, setErrors] = useState<{
    serviceName?: string;
    category?: string;
    groupId?: string;
    participants?: string;
    frontendUrl?: string;
    frontendRepo?: string;
    backendUrl?: string;
    backendRepo?: string;
  }>({});
  const [nameCheckStatus, setNameCheckStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [subdomainCheckStatus, setSubdomainCheckStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const subdomainDebounceTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [descriptionPreview, setDescriptionPreview] = useState(false);
  const [creatorColumn, setCreatorColumn] = useState(false);
  const flexRef = useRef<HTMLDivElement | null>(null);
  const outerBoxRef = useRef<HTMLDivElement | null>(null);
  const externalBoxRef = useRef<HTMLDivElement | null>(null);
  const spacerObserverRef = useRef<ResizeObserver | null>(null);
  const outerObserverRef = useRef<ResizeObserver | null>(null);
  const addButtonRef = useRef<HTMLButtonElement | null>(null);
  const [addButtonWidth, setAddButtonWidth] = useState(0);
  const [externalHeaderHeight, setExternalHeaderHeight] = useState<
    number | undefined
  >();
  const externalHeaderObserverRef = useRef<ResizeObserver | null>(null);

  const externalHeaderRef = useCallback((el: HTMLDivElement | null) => {
    if (externalHeaderObserverRef.current) {
      externalHeaderObserverRef.current.disconnect();
      externalHeaderObserverRef.current = null;
    }
    if (!el) return;
    const observer = new ResizeObserver(() => {
      const marginBottom = parseFloat(getComputedStyle(el).marginBottom);
      setExternalHeaderHeight(el.offsetHeight + marginBottom);
    });
    observer.observe(el);
    externalHeaderObserverRef.current = observer;
  }, []);

  const spacerRef = useCallback((el: HTMLDivElement | null) => {
    if (spacerObserverRef.current) {
      spacerObserverRef.current.disconnect();
      spacerObserverRef.current = null;
    }
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width <= 0) {
        setCreatorColumn(true);
      }
    });
    observer.observe(el);
    spacerObserverRef.current = observer;
  }, []);

  const externalBoxCallbackRef = useCallback((el: HTMLDivElement | null) => {
    externalBoxRef.current = el;
  }, []);

  const outerBoxCallbackRef = useCallback((el: HTMLDivElement | null) => {
    outerBoxRef.current = el;
    if (outerObserverRef.current) {
      outerObserverRef.current.disconnect();
      outerObserverRef.current = null;
    }
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const isColumn =
        getComputedStyle(flexRef.current!).flexDirection === "column";
      const outerWidth = entry.contentRect.width;
      const externalWidth = externalBoxRef.current?.offsetWidth ?? 0;
      if (!isColumn) return;
      if (externalWidth < outerWidth) setCreatorColumn(false);
    });
    observer.observe(el);
    outerObserverRef.current = observer;
  }, []);

  const navigate = useNavigate();

  const submitMutation = useMutation({
    mutationFn: ServiceRegistrationApi.submitServiceRegistration,
    onSuccess: () => {
      toast.success("서비스 등록 신청이 완료되었습니다.", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      navigate("/my");
    },
  });

  const { data: groups = [] } = useMyGroups();
  const { data: groupMembers = [] } = useGroupMembers(groupId);

  const groupCollection = useMemo(
    () =>
      createListCollection({
        items: groups.map((g) => ({ label: g.name, value: g.groupId })),
      }),
    [groups],
  );

  const checkName = useCallback(async (name: string) => {
    if (!name.trim()) return;
    setNameCheckStatus("checking");
    try {
      const res = await ServiceRegistrationApi.checkServiceName(name);
      setNameCheckStatus(res.data.available ? "available" : "taken");
    } catch {
      setNameCheckStatus("idle");
    }
  }, []);

  useEffect(() => {
    if (!serviceName.trim()) {
      setNameCheckStatus("idle");
      return;
    }
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      checkName(serviceName);
    }, 500);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [serviceName, checkName]);

  const checkSubdomain = useCallback(async (name: string) => {
    if (!name.trim()) return;
    setSubdomainCheckStatus("checking");
    try {
      const res = await ServiceRegistrationApi.checkSubdomain(name);
      setSubdomainCheckStatus(res.data.available ? "available" : "taken");
    } catch {
      setSubdomainCheckStatus("idle");
    }
  }, []);

  useEffect(() => {
    if (!subdomain.name.trim()) {
      setSubdomainCheckStatus("idle");
      return;
    }
    if (subdomainDebounceTimerRef.current)
      clearTimeout(subdomainDebounceTimerRef.current);
    subdomainDebounceTimerRef.current = setTimeout(() => {
      checkSubdomain(subdomain.name);
    }, 500);
    return () => {
      if (subdomainDebounceTimerRef.current)
        clearTimeout(subdomainDebounceTimerRef.current);
    };
  }, [subdomain.name, checkSubdomain]);

  const toggleMember = (id: number) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const addExternalCreator = () => {
    const name = externalInput.trim();
    if (!name) return;
    setExternalCreators((prev) => [...prev, name]);
    setExternalInput("");
  };

  const removeExternalCreator = (index: number) => {
    setExternalCreators((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!serviceName.trim()) newErrors.serviceName = "서비스명을 입력해주세요.";
    if (!category) newErrors.category = "카테고리를 선택해주세요.";
    if (!groupId) newErrors.groupId = "그룹을 선택해주세요.";
    if (nameCheckStatus === "taken")
      newErrors.serviceName = "이미 사용 중인 이름입니다.";
    if (groupId && selectedMemberIds.length === 0)
      newErrors.participants = "그룹원을 한 명 이상 선택해주세요.";
    if (frontend.option === "self" && !frontend.url.trim())
      newErrors.frontendUrl = "URL을 입력해주세요.";
    if (frontend.option === "request" && !frontend.repo.trim())
      newErrors.frontendRepo = "저장소 주소를 입력해주세요.";
    if (backend.option === "self" && !backend.url.trim())
      newErrors.backendUrl = "URL을 입력해주세요.";
    if (backend.option === "request" && !backend.repo.trim())
      newErrors.backendRepo = "저장소 주소를 입력해주세요.";
    const allErrors = { ...errors, ...newErrors };
    setErrors(allErrors);
    if (
      Object.values(allErrors).some(Boolean) ||
      subdomainCheckStatus === "taken"
    ) {
      const errorIdOrder = [
        {
          key: "serviceName" as keyof typeof allErrors,
          id: "field-serviceName",
        },
        { key: "category" as keyof typeof allErrors, id: "field-category" },
        { key: "groupId" as keyof typeof allErrors, id: "field-groupId" },
        {
          key: "participants" as keyof typeof allErrors,
          id: "field-participants",
        },
        { key: "frontendUrl" as keyof typeof allErrors, id: "field-frontend" },
        { key: "frontendRepo" as keyof typeof allErrors, id: "field-frontend" },
        { key: "backendUrl" as keyof typeof allErrors, id: "field-backend" },
        { key: "backendRepo" as keyof typeof allErrors, id: "field-backend" },
      ];
      const firstError = errorIdOrder.find(({ key }) => allErrors[key]);
      const scrollId =
        firstError?.id ??
        (subdomainCheckStatus === "taken" ? "field-subdomain" : null);
      if (scrollId) {
        document
          .getElementById(scrollId)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    submitMutation.mutate({
      serviceName,
      description,
      groupId,
      category,
      memberIds: selectedMemberIds,
      externalCreators,
      frontend,
      backend,
      subdomain,
    });
  };

  return (
    <Box maxW="640px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb="8">
        서비스 등록 신청
      </Text>

      <Stack gap="10">
        {/* 기본 정보 */}

        <Stack gap="6">
          <Box id="field-serviceName">
            <FieldLabel required>서비스명</FieldLabel>
            <Input
              size="sm"
              placeholder="서비스 이름을 입력하세요"
              value={serviceName}
              onChange={(e) => {
                setServiceName(e.target.value);
                if (errors.serviceName)
                  setErrors((prev) => ({ ...prev, serviceName: undefined }));
              }}
              onBlur={() => {
                if (debounceTimerRef.current)
                  clearTimeout(debounceTimerRef.current);
                checkName(serviceName);
              }}
            />
            {errors.serviceName && (
              <Text fontSize="xs" color="red.400" mt="1">
                {errors.serviceName}
              </Text>
            )}
            {!errors.serviceName && nameCheckStatus === "checking" && (
              <Text fontSize="xs" color="gray.400" mt="1">
                중복 확인 중...
              </Text>
            )}
            {!errors.serviceName && nameCheckStatus === "available" && (
              <Text fontSize="xs" color="green.500" mt="1">
                사용 가능한 이름입니다.
              </Text>
            )}
            {!errors.serviceName && nameCheckStatus === "taken" && (
              <Text fontSize="xs" color="red.400" mt="1">
                이미 사용 중인 이름입니다.
              </Text>
            )}
          </Box>
          <Box id="field-category">
            <FieldLabel required>카테고리</FieldLabel>
            <Select.Root
              collection={categoryCollection}
              value={category ? [category] : []}
              onValueChange={(e) => {
                setCategory(e.value[0]);
                if (errors.category)
                  setErrors((prev) => ({ ...prev, category: undefined }));
              }}
              size="sm"
            >
              <Select.Trigger borderWidth={1} borderRadius="md">
                <Select.ValueText placeholder="카테고리를 선택하세요" />
                <Select.Indicator>
                  <ChevronDown size={14} />
                </Select.Indicator>
              </Select.Trigger>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {categoryCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            {errors.category && (
              <Text fontSize="xs" color="red.400" mt="1">
                {errors.category}
              </Text>
            )}
          </Box>
          <Box id="field-groupId">
            <FieldLabel required>그룹</FieldLabel>
            <Select.Root
              collection={groupCollection}
              value={groupId ? [groupId] : []}
              onValueChange={(e) => {
                setGroupId(e.value[0]);
                setSelectedMemberIds([]);
                if (errors.groupId)
                  setErrors((prev) => ({ ...prev, groupId: undefined }));
              }}
              size="sm"
            >
              <Select.Trigger borderWidth={1} borderRadius="md">
                <Select.ValueText placeholder="그룹을 선택하세요" />
                <Select.Indicator>
                  <ChevronDown size={14} />
                </Select.Indicator>
              </Select.Trigger>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {groupCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            {errors.groupId && (
              <Text fontSize="xs" color="red.400" mt="1">
                {errors.groupId}
              </Text>
            )}
          </Box>
        </Stack>

        {/* 참여자 */}
        {groupId && (
          <Box ref={outerBoxCallbackRef}>
            <SectionTitle>참여자</SectionTitle>
            <Flex
              gap="4"
              align="start"
              flexDir={creatorColumn ? "column" : "row"}
              ref={flexRef}
            >
              <Box
                id="field-participants"
                style={{ flex: "1 1 0", minWidth: 0 }}
              >
                <Box style={{ minHeight: externalHeaderHeight }}>
                  <FieldLabel>그룹원</FieldLabel>
                </Box>
                <Stack gap="2">
                  {groupMembers.map((member) => (
                    <Checkbox.Root
                      key={member.memberId}
                      checked={selectedMemberIds.includes(member.memberId)}
                      onCheckedChange={() => {
                        toggleMember(member.memberId);
                        if (errors.participants)
                          setErrors((prev) => ({
                            ...prev,
                            participants: undefined,
                          }));
                      }}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>{member.name}</Checkbox.Label>
                    </Checkbox.Root>
                  ))}
                </Stack>
                {errors.participants && (
                  <Text fontSize="xs" color="red.400" mt="2">
                    {errors.participants}
                  </Text>
                )}
              </Box>
              <Box
                style={{ flex: "2 2 0", minWidth: 0 }}
                ref={externalBoxCallbackRef}
              >
                <Flex align="center" gap="2" mb="2" ref={externalHeaderRef}>
                  <Text
                    fontSize="md"
                    fontWeight="medium"
                    color="gray.600"
                    flexShrink={0}
                    whiteSpace="nowrap"
                    alignSelf="start"
                  >
                    외부 인원
                  </Text>
                  <Box flex="1" ref={spacerRef} />
                  <Input
                    size="sm"
                    flex="2"
                    minW={addButtonWidth > 0 ? addButtonWidth * 1.5 : undefined}
                    placeholder="이름 입력"
                    value={externalInput}
                    onChange={(e) => setExternalInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addExternalCreator()}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addExternalCreator}
                    flexShrink={0}
                    ref={(el) => {
                      addButtonRef.current = el;
                      if (el) setAddButtonWidth(el.offsetWidth);
                    }}
                  >
                    추가
                  </Button>
                </Flex>
                {externalCreators.length > 0 && (
                  <Stack gap="2">
                    {externalCreators.map((name, i) => (
                      <Checkbox.Root
                        key={i}
                        checked
                        onCheckedChange={() => removeExternalCreator(i)}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                        <Checkbox.Label>{name}</Checkbox.Label>
                      </Checkbox.Root>
                    ))}
                  </Stack>
                )}
              </Box>
            </Flex>
          </Box>
        )}

        {/* 소개 문구 */}
        <Box>
          <SectionTitle>소개 문구</SectionTitle>
          <Flex gap="2" mb="1.5">
            <OptionButton
              label="편집"
              selected={!descriptionPreview}
              onClick={() => setDescriptionPreview(false)}
            />
            <OptionButton
              label="미리보기"
              selected={descriptionPreview}
              onClick={() => setDescriptionPreview(true)}
            />
          </Flex>
          {descriptionPreview ? (
            <Box
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              p="3"
              minH="150px"
              fontSize="sm"
              color={description ? "gray.800" : "gray.400"}
            >
              {description ? (
                <Prose maxW="unset">
                  <ReactMarkdown>{description}</ReactMarkdown>
                </Prose>
              ) : (
                "미리보기할 내용이 없습니다"
              )}
            </Box>
          ) : (
            <Textarea
              placeholder={
                "서비스 소개 페이지에 표시될 내용을 자유롭게 작성해 주세요.\n서비스 설명, 팀 소개, 배포 링크, 레포지토리 등을 포함하면 좋습니다.\n\n마크다운 문법을 지원합니다."
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
            />
          )}
        </Box>

        {/* 호스팅 옵션 */}
        <Box>
          <SectionTitle>호스팅 옵션</SectionTitle>
          <Stack gap="6">
            <Text fontSize="sm" color="gray.500">
              여기에 입력하는 링크는 운영진 검토용으로만 사용되며, 서비스 소개
              페이지에는 표시되지 않습니다.
              <br />
              배포 링크, 레포지토리, 소개 페이지 등 방문자에게 공개하고 싶은
              내용은 서비스 소개 문구에 직접 작성해 주세요.
            </Text>
            <HostingSection
              id="field-frontend"
              label="프런트엔드"
              option={frontend.option}
              onChange={(v) => {
                setFrontend((prev) => ({ ...prev, option: v }));
                setErrors((prev) => ({
                  ...prev,
                  frontendUrl: undefined,
                  frontendRepo: undefined,
                }));
              }}
              urlValue={frontend.url}
              onUrlChange={(v) => {
                setFrontend((prev) => ({ ...prev, url: v }));
                if (errors.frontendUrl)
                  setErrors((prev) => ({ ...prev, frontendUrl: undefined }));
              }}
              repoValue={frontend.repo}
              onRepoChange={(v) => {
                setFrontend((prev) => ({ ...prev, repo: v }));
                if (errors.frontendRepo)
                  setErrors((prev) => ({ ...prev, frontendRepo: undefined }));
              }}
              urlPlaceholder="https://your-service.com"
              selfHint="자체 프런트엔드 서버 주소를 적어주세요."
              requestHint="쿠러그에서 관리하는 Cloudflare Pages로 호스팅됩니다. 깃허브 저장소 주소를 적어주세요."
              urlError={errors.frontendUrl}
              repoError={errors.frontendRepo}
            />
            <HostingSection
              id="field-backend"
              label="백엔드"
              option={backend.option}
              onChange={(v) => {
                setBackend((prev) => ({ ...prev, option: v }));
                setErrors((prev) => ({
                  ...prev,
                  backendUrl: undefined,
                  backendRepo: undefined,
                }));
              }}
              urlValue={backend.url}
              onUrlChange={(v) => {
                setBackend((prev) => ({ ...prev, url: v }));
                if (errors.backendUrl)
                  setErrors((prev) => ({ ...prev, backendUrl: undefined }));
              }}
              repoValue={backend.repo}
              onRepoChange={(v) => {
                setBackend((prev) => ({ ...prev, repo: v }));
                if (errors.backendRepo)
                  setErrors((prev) => ({ ...prev, backendRepo: undefined }));
              }}
              urlPlaceholder="https://api.your-service.com"
              selfHint="자체 백엔드 서버 주소를 적어주세요."
              requestHint="쿠러그 LAB 서버에서 도커로 호스팅됩니다. 깃허브 저장소 주소를 적어주세요."
              urlError={errors.backendUrl}
              repoError={errors.backendRepo}
            />
            <Box id="field-subdomain">
              <FieldLabel>서브도메인</FieldLabel>
              <Flex gap="2" mb="2">
                <OptionButton
                  label="불필요"
                  selected={!subdomain.requested}
                  onClick={() => setSubdomain({ requested: false, name: "" })}
                />
                <OptionButton
                  label="신청"
                  selected={subdomain.requested}
                  onClick={() =>
                    setSubdomain((prev) => ({ ...prev, requested: true }))
                  }
                />
              </Flex>
              {subdomain.requested && (
                <Box>
                  <Flex align="center" gap="1">
                    <Input
                      size="sm"
                      maxW="160px"
                      placeholder="subdomain"
                      value={subdomain.name}
                      onChange={(e) =>
                        setSubdomain((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      onBlur={() => {
                        if (subdomainDebounceTimerRef.current)
                          clearTimeout(subdomainDebounceTimerRef.current);
                        checkSubdomain(subdomain.name);
                      }}
                    />
                    <Text fontSize="sm" color="gray.500" flexShrink={0}>
                      .khlugy.app
                    </Text>
                  </Flex>
                  <Text
                    fontSize="xs"
                    mt="1"
                    color={
                      subdomainCheckStatus === "available"
                        ? "green.500"
                        : subdomainCheckStatus === "taken"
                          ? "red.400"
                          : "gray.400"
                    }
                  >
                    {subdomainCheckStatus === "available"
                      ? "사용 가능한 서브도메인입니다."
                      : subdomainCheckStatus === "taken"
                        ? "이미 사용 중인 서브도메인입니다."
                        : subdomainCheckStatus === "checking"
                          ? "중복 확인 중..."
                          : "쿠러기 도메인의 서브도메인으로 호스팅됩니다. 원하는 서브도메인을 적어주세요."}
                  </Text>
                </Box>
              )}
            </Box>
          </Stack>
        </Box>

        <Button colorPalette="blue" onClick={handleSubmit}>
          신청하기
        </Button>
      </Stack>
    </Box>
  );
}
