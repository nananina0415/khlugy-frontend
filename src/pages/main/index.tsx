import { MainLayout } from "@khlug/common-module";
import HeroBanner from "../../features/main/HeroBanner";
import ServiceCard from "../../features/main/ServiceCard";

const services = [
  { title: "서비스 1", description: "서비스 설명입니다." },
  { title: "서비스 2", description: "서비스 설명입니다." },
  { title: "서비스 3", description: "서비스 설명입니다." },
];

export default function MainPage() {
  return (
    <MainLayout logoUrl="/khulugy_logo.png" logoHref="/">
      <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
        <HeroBanner />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {services.map((service) => (
            <ServiceCard key={service.title} title={service.title} description={service.description} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}