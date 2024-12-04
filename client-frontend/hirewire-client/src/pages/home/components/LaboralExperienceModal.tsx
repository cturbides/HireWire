import React from "react";
import { Modal, Form, Input, Button, DatePicker } from "antd";

interface LaboralExperienceModalProps {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const { RangePicker } = DatePicker;

export const LaboralExperienceModal: React.FC<LaboralExperienceModalProps> = ({
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
      width={600}
      footer={null}
      visible={visible}
      onCancel={onClose}
      title="Add Laboral Experience"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Company"
          name="company"
          rules={[{ required: true, message: "Please enter the company name" }]}
        >
          <Input placeholder="Enter company name" />
        </Form.Item>

        <Form.Item
          label="Position"
          name="position"
          rules={[{ required: true, message: "Please enter the position" }]}
        >
          <Input placeholder="Enter position" />
        </Form.Item>

        <Form.Item
          label="Salary"
          name="salary"
          rules={[
            { required: true, message: "Please enter the salary" },
            { type: "number", min: 0, message: "Salary must be positive" },
          ]}
          getValueFromEvent={(event) => {
            const value = event.target.value;
            return value === "" ? undefined : Number(value);
          }}
        >
          <Input type="number" placeholder="Enter salary" />
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
