import { MainLayout, useCurrentUser } from "@khlug/common-module";
import { MENU_ITEMS } from "./menuData";

type Props = { children: React.ReactNode };

export default function KhlugyLayout({ children }: Props) {
  const { data: user } = useCurrentUser();
  const current = window.location.pathname;
  const isLoggedIn = !!user?.id;

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        <div
          style={{ maxWidth: "1024px", margin: "0 auto", padding: "40px 16px" }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <MainLayout logoUrl="/khulugy_logo.png" logoHref="/" menuItems={MENU_ITEMS} current={current}>
      {children}
    </MainLayout>
  );
}
