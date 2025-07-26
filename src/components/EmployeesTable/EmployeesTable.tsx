import { useState, useMemo, useCallback, useEffect } from 'react';
import { Table, Button, Input, Space, Popover } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

import EmployeeForm from '../EmployeeForm/EmployeeForm';
import type { IEmployee } from '../../shared/types/employee.interface';
import type { EmployeeFormData } from '../EmployeeForm/employeeSchema';
import { getEmployeeColumns } from '../../shared/data/columns';
import { loadEmployees, saveEmployees } from '../../shared/utils/localStorage';

const { Search } = Input;

export const EmployeesTable = () => {
  const [data, setData] = useState<IEmployee[]>(() => loadEmployees());
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

  const handleSearch = (value: string) => {
    setSearchText(value.toLowerCase());
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
    () => getEmployeeColumns(showEditModal, handleDelete),
    [showEditModal, handleDelete]
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
          <Search
            placeholder='Поиск по таблице...'
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 300 }}
            popover='auto'
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
        onCancel={() => {
          setIsModalVisible(false);
          setEditingEmployee(null);
        }}
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
