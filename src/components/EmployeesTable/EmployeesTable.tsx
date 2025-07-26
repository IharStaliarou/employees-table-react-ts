import { useState, useMemo, useCallback, useEffect } from 'react';
import { Table, Button, Input, Space, Popover } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

import EmployeeForm from '../EmployeeForm/EmployeeForm';
import type { IEmployee } from '../../shared/types/employee.interface';
import type { EmployeeFormData } from '../EmployeeForm/employeeSchema';
import { getEmployeeColumns } from '../../shared/data/columns';
import { loadEmployees, saveEmployees } from '../../shared/utils/localStorage';
import { MOCK_EMPLOYEES } from '../../shared/data/employees';

export const EmployeesTable = () => {
  const [data, setData] = useState<IEmployee[]>(() => {
    const savedEmployees = loadEmployees();
    return savedEmployees.length > 0 ? savedEmployees : MOCK_EMPLOYEES;
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<IEmployee | null>(
    null
  );
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    saveEmployees(data);
  }, [data]);

  const handleAdd = (values: EmployeeFormData) => {
    const newEmployee: IEmployee = {
      id: uuidv4(),
      name: values.name,
      date: values.date,
      salary: values.salary,
    };
    setData((prev) => [...prev, newEmployee]);
    setIsModalVisible(false);
  };

  const handleEdit = (values: EmployeeFormData) => {
    if (editingEmployee) {
      setData(
        data.map((item: IEmployee) =>
          item.id === editingEmployee.id
            ? {
                ...item,
                name: values.name,
                date: values.date,
                salary: values.salary,
              }
            : item
        )
      );
      setEditingEmployee(null);
      setIsModalVisible(false);
    }
  };

  const handleDelete = useCallback((id: string) => {
    setData((prev) => prev.filter((item: IEmployee) => item.id !== id));
  }, []);

  const showEditModal = useCallback((employee: IEmployee) => {
    setEditingEmployee(employee);
    setIsModalVisible(true);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const handleCancel = () => {
    setEditingEmployee(null);
    setIsModalVisible(false);
  };

  const filteredData = useMemo(() => {
    if (!searchText) {
      return data;
    }
    return data.filter((item: IEmployee) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchText)
      )
    );
  }, [data, searchText]);

  const columns = useMemo(
    () => getEmployeeColumns(showEditModal, handleDelete, searchText),
    [showEditModal, handleDelete, searchText]
  );

  return (
    <div style={{ padding: '20px' }}>
      <Space
        style={{
          marginBottom: 16,
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingEmployee(null);
            setIsModalVisible(true);
          }}
        >
          Добавить
        </Button>
        <Popover>
          <Input
            placeholder='Поиск по таблице...'
            allowClear
            onChange={handleSearch}
            style={{ width: 300 }}
            prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
          />
        </Popover>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData.map((item: IEmployee) => ({
          ...item,
          key: item.id,
        }))}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <EmployeeForm
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmitEmployee={editingEmployee ? handleEdit : handleAdd}
        initialValues={
          editingEmployee
            ? {
                name: editingEmployee.name,
                date: editingEmployee.date,
                salary: editingEmployee.salary,
              }
            : null
        }
      />
    </div>
  );
};
