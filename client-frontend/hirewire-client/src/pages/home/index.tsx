import { Layout } from "antd";
import { useEffect, useState, useRef } from "react";
import { ColorModeContextProvider } from "../../contexts/color-mode";
import { PositionsList } from "./components/PositionList";
import { HeaderSection } from "./components/HeaderSection";
import { PositionModal } from "./components/PositionModal";
import { EducationModal } from "./components/EducationModal";
import { LaboralExperienceModal } from "./components/LaboralExperienceModal";
import { Skill, Position, LaboralExperience, Education } from "./common/types";
import { fetchSkills } from "./common/fetchSkills";
import { fetchEducation } from "./common/fetchEducation";
import { saveEducation } from "./common/saveEducation";
import { saveLaboralExperience } from "./common/saveLaboralExperience";
import { fetchLaboralExperiences } from "./common/fetchLaboralExperiences";
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
  const [isError, setIsError] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLaboralExperienceModalVisible, setIsLaboralExperienceModalVisible] =
    useState<boolean>(false);
  const [isEducationModalVisible, setIsEducationModalVisible] =
    useState<boolean>(false);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [laboralExperiences, setLaboralExperiences] = useState<
    LaboralExperience[]
  >([]);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const getPositions = async (page: number) => {
    if (loading) return;

    setIsError(false);
    setLoading(true);

    try {
      const [
        positionsResponse,
        skillsResponse,
        educationResponse,
        laboralExperiencesResponse,
      ] = await Promise.all([
        fetchAvailablePositions(page, 10),
        fetchSkills(),
        fetchEducation(),
        fetchLaboralExperiences(),
      ]);

      const { data, meta } = positionsResponse;
      const { data: skills } = skillsResponse;
      const { data: education } = educationResponse;
      const { data: laboralExperiences } = laboralExperiencesResponse;

      setSkills(skills);
      setEducations(education);
      setLaboralExperiences(laboralExperiences);
      setPositions((prev) => (page === 1 ? data : [...prev, ...data]));
      setPaginationMeta(meta);
    } catch (error) {
      setIsError(true);
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
    setIsError(false);
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

  const handleOpenLaboralExperienceModal = () => {
    setIsLaboralExperienceModalVisible(true);
  };

  const handleCloseLaboralExperienceModal = () => {
    setIsLaboralExperienceModalVisible(false);
  };

  const handleOpenEducationModal = () => {
    setIsEducationModalVisible(true);
  };

  const handleCloseEducationModal = () => {
    setIsEducationModalVisible(false);
  };

  const handleLaboralExperienceSubmit = async (values: any) => {
    console.log("New Laboral Experience:", values);

    try {
      const response = await saveLaboralExperience(values);
      console.log("Laboral Experience created successfully:", response);
      handleCloseLaboralExperienceModal();
    } catch (error) {
      console.error("Error creating laboral experience:", error);
    } finally {
      setIsLaboralExperienceModalVisible(false);
      handleRefresh();
    }
  };

  const handleEducationSubmit = async (values: any) => {
    console.log("New Education:", values);
    try {
      const response = await saveEducation(values);
      console.log("Education created successfully:", response);
      handleCloseEducationModal();
    } catch (error) {
      console.error("Error creating Education:", error);
    } finally {
      setIsEducationModalVisible(false);
      handleRefresh();
    }
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
        <HeaderSection
          loading={loading}
          onRefresh={handleRefresh}
          onAddEducation={handleOpenEducationModal}
          onAddLaboralExperience={handleOpenLaboralExperienceModal}
        />
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
            isError={isError}
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

        {isLaboralExperienceModalVisible && (
          <LaboralExperienceModal
            loading={loading}
            visible={isLaboralExperienceModalVisible}
            onClose={handleCloseLaboralExperienceModal}
            onSubmit={handleLaboralExperienceSubmit}
          />
        )}

        {isEducationModalVisible && (
          <EducationModal
            loading={loading}
            visible={isEducationModalVisible}
            onClose={handleCloseEducationModal}
            onSubmit={handleEducationSubmit}
          />
        )}
      </Layout>
    </ColorModeContextProvider>
  );
};
