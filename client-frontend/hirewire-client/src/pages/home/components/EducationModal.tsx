import React from "react";
import { EducationLevel } from "../common/types";
import { Modal, Form, Input, Button, DatePicker, Select } from "antd";

interface EducationModalProps {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const { RangePicker } = DatePicker;

export const EducationModal: React.FC<EducationModalProps> = ({
  visible,
  loading,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const { dateRange, ...rest } = values;

    const formattedValues = {
      ...rest,
      startDate: dateRange ? dateRange[0].toISOString() : null,
      endDate: dateRange && dateRange[1] ? dateRange[1].toISOString() : null,
    };

    onSubmit(formattedValues);
  };

  return (
    <Modal
      footer={null}
      width={600}
      visible={visible}
      onCancel={onClose}
      title="Add Education"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Institution"
          name="institution"
          rules={[
            { required: true, message: "Please enter the institution name" },
          ]}
        >
          <Input placeholder="Enter institution name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input placeholder="Enter description (e.g., Course name)" />
        </Form.Item>

        <Form.Item
          label="Education Level"
          name="level"
          rules={[
            { required: true, message: "Please select an education level" },
          ]}
        >
          <Select placeholder="Select education level">
            {Object.values(EducationLevel).map((level) => (
              <Select.Option key={level} value={level}>
                {level}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Date Range"
          name="dateRange"
          rules={[{ required: true, message: "Please select the date range" }]}
        >
          <RangePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
