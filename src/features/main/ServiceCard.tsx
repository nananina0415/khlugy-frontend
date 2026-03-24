type Props = {
  title: string;
  description: string;
};

export default function ServiceCard({ title, description }: Props) {
  return (
    <div style={{
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "24px",
      background: "#fff",
    }}>
      <h3 style={{ margin: "0 0 8px" }}>{title}</h3>
      <p style={{ margin: 0, color: "#718096" }}>{description}</p>
    </div>
  );
}