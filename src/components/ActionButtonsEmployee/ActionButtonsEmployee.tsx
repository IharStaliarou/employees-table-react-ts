import { Space, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import type { IEmployee } from '../../shared/types/employee.interface';
import { UI_FIELDS } from '../../shared/constants/fields';

interface Props {
  record: IEmployee;
  onEdit: (employee: IEmployee) => void;
  onDelete: (id: string) => void;
}

export const ActionButtonsEmployee = ({ record, onEdit, onDelete }: Props) => {
  return (
    <Space>
      <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
        Редактировать
      </Button>
      <Popconfirm
        title={UI_FIELDS.confirmDeleteEmployee}
        onConfirm={() => onDelete(record.id)}
        okText='Да'
        cancelText='Нет'
      >
        <Button icon={<DeleteOutlined />} danger>
          Удалить
        </Button>
      </Popconfirm>
    </Space>
  );
};
