import { type MenuItem } from "@khlug/common-module";

export const MENU_ITEMS: MenuItem[] = [
  {
    label: "서비스 등록",
    href: "/submit/guide",
    subItems: [
      { label: "신청 방법", href: "/submit/guide" },
      { label: "호스팅 안내", href: "/hosting/guide" },
      { label: "신청하기", href: "/submit" },
    ],
    requiresMember: true,
  },
  {
    label: "관리",
    href: "/manage",
    subItems: [{ label: "등록 신청 목록", href: "/manage/submissions" }],
    requiresManager: true,
  },
  { label: "마이페이지", href: "/my", subItems: [], requiresMember: true },
];
