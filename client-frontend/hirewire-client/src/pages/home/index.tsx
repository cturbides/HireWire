import { Layout } from "antd";
import { useEffect, useState, useRef } from "react";
import { ColorModeContextProvider } from "../../contexts/color-mode";
import { PositionsList } from "./components/PositionList";
import { HeaderSection } from "./components/HeaderSection";
import { PositionModal } from "./components/PositionModal";
import { Skill, Position, LaboralExperience, Education } from "./common/types";
import {
  PaginationMeta,
  fetchAvailablePositions,
} from "./common/fetchPositions";

const { Content } = Layout;

export const Home = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [laboralExperiences, setLaboralExperiences] = useState<
    LaboralExperience[]
  >([]);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const getPositions = async (page: number) => {
    if (loading) return;

    setLoading(true);
    try {
      const { data, meta } = await fetchAvailablePositions(page, 10);

      setPositions((prev) => (page === 1 ? data : [...prev, ...data]));
      setPaginationMeta(meta);
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (!contentRef.current || !paginationMeta) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;

    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      paginationMeta.hasNextPage
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setPositions([]);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleOpenModal = (position: Position) => {
    setSelectedPosition(position);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedPosition(null);
  };

  const handleSubmit = (values: any) => {
    console.log("Updated Position:", { ...selectedPosition, ...values });
    handleCloseModal();
  };

  useEffect(() => {
    document.title = "HireWire Client - Home";
  }, []);

  useEffect(() => {
    getPositions(currentPage);
  }, [currentPage, refreshKey]);

  return (
    <ColorModeContextProvider>
      <Layout style={{ minHeight: "100vh", background: "#1f1f1f" }}>
        <HeaderSection loading={loading} onRefresh={handleRefresh} />
        <Content
          ref={contentRef}
          onScroll={handleScroll}
          style={{
            color: "#fff",
            padding: "24px",
            display: "flex",
            overflowY: "auto",
            alignItems: "center",
            background: "#1f1f1f",
            flexDirection: "column",
            height: "calc(100vh - 64px)",
          }}
        >
          <PositionsList
            positions={positions}
            loading={loading}
            onEdit={handleOpenModal}
          />
        </Content>

        <PositionModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          position={selectedPosition}
          skills={skills}
          loading={loading}
          educations={educations}
          laboralExperiences={laboralExperiences}
        />
      </Layout>
    </ColorModeContextProvider>
  );
};
