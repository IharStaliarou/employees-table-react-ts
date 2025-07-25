import { useState, useMemo, useCallback } from 'react';
import { Table, Button, Input, Space, Popover } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

import EmployeeForm from '../EmployeeForm/EmployeeForm';
import type { IEmployee } from '../../shared/types/employee.interface';
import type { EmployeeFormData } from '../EmployeeForm/employeeSchema';
import { getEmployeeColumns } from '../../shared/data/columns';
import { DATE_FORMAT } from '../../shared/constants';

const { Search } = Input;

export const EmployeesTable = () => {
  const [data, setData] = useState<IEmployee[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<IEmployee | null>(null);
  const [searchText, setSearchText] = useState('');

  const handleAdd = (values: EmployeeFormData) => {
    const newVacancy: IEmployee = {
      id: uuidv4(),
      name: values.name,
      date: dayjs(values.date).toISOString(),
      salary: values.salary,
    };
    setData((prev) => [...prev, newVacancy]);
    setIsModalVisible(false);
  };

  const handleEdit = (values: EmployeeFormData) => {
    if (editingVacancy) {
      setData(
        data.map((item) =>
          item.id === editingVacancy.id
            ? {
                ...item,
                name: values.name,
                date: dayjs(values.date).toISOString(),
                salary: values.salary,
              }
            : item
        )
      );
      setEditingVacancy(null);
      setIsModalVisible(false);
    }
  };

  const handleDelete = useCallback((id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showEditModal = useCallback((vacancy: IEmployee) => {
    setEditingVacancy(vacancy);
    setIsModalVisible(true);
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value.toLowerCase());
  };

  const filteredData = useMemo(() => {
    if (!searchText) {
      return data;
    }
    return data.filter((item) =>
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
            setEditingVacancy(null);
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
        dataSource={filteredData.map((item) => ({ ...item, key: item.id }))}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <EmployeeForm
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingVacancy(null);
        }}
        onSubmitEmployee={editingVacancy ? handleEdit : handleAdd}
        initialValues={
          editingVacancy
            ? {
                name: editingVacancy.name,
                date: dayjs(editingVacancy.date).format(DATE_FORMAT),
                salary: editingVacancy.salary,
              }
            : null
        }
      />
    </div>
  );
};
