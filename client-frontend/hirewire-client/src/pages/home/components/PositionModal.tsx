import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { Position } from "../common/fetchPositions";

interface PositionModalProps {
  visible: boolean;
  onClose: () => void;
  loading: boolean;
  position: Position | null;
  onSubmit: (values: any) => void;
}

export const PositionModal: React.FC<PositionModalProps> = ({
  visible,
  onClose,
  onSubmit,
  position,
  loading,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (position) {
      form.setFieldsValue(position);
    } else {
      form.resetFields();
    }
  }, [position, form]);

  return (
    <Modal
      title={`Edit Position: ${position?.name || "New Position"}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={position || {}}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the name" }]}
        >
          <Input placeholder="Position Name" />
        </Form.Item>
        <Form.Item
          label="Min Salary"
          name="minSalary"
          rules={[
            { required: true, message: "Please enter the minimum salary" },
          ]}
        >
          <Input type="number" placeholder="Min Salary" />
        </Form.Item>
        <Form.Item
          label="Max Salary"
          name="maxSalary"
          rules={[
            { required: true, message: "Please enter the maximum salary" },
          ]}
        >
          <Input type="number" placeholder="Max Salary" />
        </Form.Item>
        <Form.Item
          label="Risk Level"
          name="riskLevel"
          rules={[{ required: true, message: "Please select a risk level" }]}
        >
          <Input placeholder="Risk Level (LOW, MEDIUM, HIGH)" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Description" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
