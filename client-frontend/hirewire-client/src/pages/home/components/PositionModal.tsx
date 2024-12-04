import React from "react";
import { formatDate } from "../../../utils/formatDate";
import { formatCurrency } from "../../../utils/formatCurrency";
import { Modal, Form, Input, Button, Select, Typography, Divider } from "antd";
import { Skill, Position, LaboralExperience, Education } from "../common/types";

interface ApplicantModalProps {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  skills: Array<Skill>;
  position: Position | null;
  educations: Array<Education>;
  onSubmit: (values: any) => void;
  laboralExperiences: Array<LaboralExperience>;
}

const { Title, Paragraph } = Typography;

export const PositionModal: React.FC<ApplicantModalProps> = ({
  skills,
  visible,
  onClose,
  loading,
  position,
  onSubmit,
  educations,
  laboralExperiences,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (position) {
      form.resetFields();
    }
  }, [position, form]);

  return (
    <Modal visible={visible} onCancel={onClose} footer={null} width={800}>
      {position && (
        <>
          <Title level={4}>{position.name}</Title>
          <Paragraph>
            Salary Range: {formatCurrency(position.minSalary)} -{" "}
            {formatCurrency(position.maxSalary)}
          </Paragraph>
          <Paragraph>
            Risk Level: {position.riskLevel} |{" "}
            {position.available ? "Available" : "Not Available"}
          </Paragraph>
          <Paragraph>Descripción: {position.description}</Paragraph>
          <Divider />
        </>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) =>
          onSubmit({
            ...values,
            positionId: position?.id,
          })
        }
      >
        {/* Desired Salary */}
        <Form.Item
          label="Desired Salary"
          name="desiredSalary"
          rules={[
            { required: true, message: "Please enter the desired salary" },
          ]}
        >
          <Input type="number" placeholder="Enter desired salary" />
        </Form.Item>

        {/* Recommended By */}
        <Form.Item
          label="Recommended By"
          name="recommendedBy"
          rules={[
            { required: true, message: "Please specify who recommended" },
          ]}
        >
          <Input placeholder="Enter recommender's name" />
        </Form.Item>

        {/* Skills */}
        <Form.Item
          label="Skills"
          name="skillIds"
          rules={[
            { required: true, message: "Please select at least one skill" },
          ]}
        >
          <Select mode="multiple" placeholder="Select skills">
            {skills.map((skill) => (
              <Select.Option key={skill.id} value={skill.id}>
                {skill.description}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Laboral Experiences */}
        <Form.Item
          label="Laboral Experiences"
          name="laboralExperienceIds"
          rules={[
            { required: true, message: "Please select laboral experiences" },
          ]}
        >
          <Select mode="multiple" placeholder="Select laboral experiences">
            {laboralExperiences.map((experience) => (
              <Select.Option key={experience.id} value={experience.id}>
                {experience.position} - {experience.company} -
                {formatDate(experience.startDate)} -
                {formatDate(experience.endDate)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Educations */}
        <Form.Item
          label="Educations"
          name="educationIds"
          rules={[{ required: true, message: "Please select educations" }]}
        >
          <Select mode="multiple" placeholder="Select educations">
            {educations.map((education) => (
              <Select.Option key={education.id} value={education.id}>
                {education.description} - {education.institution} -{" "}
                {formatDate(education.startDate)} -
                {formatDate(education.endDate)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Submit Application
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
