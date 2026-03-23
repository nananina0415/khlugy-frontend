import { MainLayout } from "@khlug/common-module";

type Props = {
  children: React.ReactNode;
};

function SampleLayout({ children }: Props) {
  return <MainLayout>{children}</MainLayout>;
}

export default SampleLayout;