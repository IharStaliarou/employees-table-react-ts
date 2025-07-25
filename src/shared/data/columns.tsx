import type { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';

import type { IEmployee } from '../types/employee.interface';
import { SortOrderType } from '../types/sort.type';
import { sortbyName, sortByDate, sortBySalary } from '../utils/sortUtils';
import { ActionButtonsEmployee } from '../../components/ActionButtonsEmployee/ActionButtonsEmployee';
import { DATE_FORMAT } from '../constants';

export const getEmployeeColumns = (
  onEdit: (vacancy: IEmployee) => void,
  onDelete: (id: string) => void
): ColumnType<IEmployee>[] => {
  return [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      sorter: sortbyName,
      sortDirections: SortOrderType,
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => dayjs(text).format(DATE_FORMAT),
      sorter: sortByDate,
      sortDirections: SortOrderType,
    },
    {
      title: 'Заработная плата',
      dataIndex: 'value',
      key: 'value',
      sorter: sortBySalary,
      sortDirections: SortOrderType,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record: IEmployee) => (
        <ActionButtonsEmployee
          record={record}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
};
