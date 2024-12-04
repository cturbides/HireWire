import { Button, Layout, Typography } from "antd";
import { useLogout } from "@refinedev/core";

const { Header } = Layout;
const { Title } = Typography;

interface HeaderSectionProps {
  loading: boolean;
  onRefresh: () => void;
  onAddEducation: () => void;
  onAddLaboralExperience: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  loading,
  onRefresh,
  onAddEducation,
  onAddLaboralExperience,
}) => {
  const { mutate: logout } = useLogout();

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#141414",
        padding: "0 24px",
      }}
    >
      <Title
        level={3}
        style={{
          color: "#fff",
          margin: 0,
        }}
      >
        HireWire
      </Title>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Button
          type="default"
          onClick={onRefresh}
          loading={loading}
          style={{
            background: "#262626",
            color: "#fff",
            borderColor: "#fff",
          }}
        >
          Refresh
        </Button>

        <Button
          type="default"
          onClick={onAddLaboralExperience}
          style={{
            background: "#1d4ed8",
            color: "#fff",
            borderColor: "#1d4ed8",
          }}
        >
          Add Experience
        </Button>

        <Button
          type="default"
          onClick={onAddEducation}
          style={{
            background: "#047857",
            color: "#fff",
            borderColor: "#047857",
          }}
        >
          Add Education
        </Button>

        <Button
          type="primary"
          onClick={() => logout()}
          style={{
            background: "#f5222d",
            borderColor: "#f5222d",
          }}
        >
          Logout
        </Button>
      </div>
    </Header>
  );
};
