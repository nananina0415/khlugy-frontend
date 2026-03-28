import { MainLayout, useCurrentUser, type MenuItem } from "@khlug/common-module";

const MENU_ITEMS: MenuItem[] = [
  { label: "등록", href: "/submit", subItems: [], requiresMember: true },
  { label: "관리", href: "/manage/submissions", subItems: [], requiresManager: true },
  { label: "마이페이지", href: "/my", subItems: [], requiresMember: true },
];

type Props = { children: React.ReactNode };

export default function KhlugyLayout({ children }: Props) {
  const { data: user } = useCurrentUser();
  const isLoggedIn = !!user?.id;

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "40px 16px" }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <MainLayout logoUrl="/khulugy_logo.png" logoHref="/" menuItems={MENU_ITEMS}>
      {children}
    </MainLayout>
  );
}