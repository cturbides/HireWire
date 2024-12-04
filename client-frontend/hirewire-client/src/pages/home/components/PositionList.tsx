import { Typography } from "antd";
import { Position } from "../common/fetchPositions";
import { formatCurrency } from "../../../utils/formatCurrency";

const { Title } = Typography;

interface PositionsListProps {
  loading: boolean;
  positions: Position[];
  onEdit: (position: Position) => void;
}

export const PositionsList: React.FC<PositionsListProps> = ({
  positions,
  loading,
  onEdit,
}) => {
  return (
    <>
      <Title
        level={2}
        style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: "16px",
        }}
      >
        Available Positions
      </Title>

      {positions.map((position, index) => (
        <a
          href="#"
          key={index}
          onClick={() => onEdit(position)}
          style={{
            color: "#1890ff",
            cursor: "pointer",
            textDecoration: "none",
            display: "block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textAlign: "center",
            textOverflow: "ellipsis",
            width: "100%",
            maxWidth: "600px",
            margin: "8px 0",
          }}
          title={position.name as string}
        >
          {`${position.name} - ${formatCurrency(
            position.minSalary
          )}-${formatCurrency(position.maxSalary)} | Risk: ${
            position.riskLevel
          } | ${position.available ? "Available" : "Not Available"}`}
        </a>
      ))}

      {loading && (
        <Typography.Paragraph
          style={{ color: "#fff", marginTop: "16px", textAlign: "center" }}
        >
          Loading more positions...
        </Typography.Paragraph>
      )}
    </>
  );
};
