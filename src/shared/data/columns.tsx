import type { ColumnType } from 'antd/es/table';
import dayjs from 'dayjs';

import type { IEmployee } from '../types/employee.interface';
import { SortOrderType } from '../types/sort.type';
import { sortbyName, sortByDate, sortBySalary } from '../utils/sortUtils';
import { ActionButtonsEmployee } from '../../components/ActionButtonsEmployee/ActionButtonsEmployee';
import { DATE_FORMAT } from '../constants';
import { UI_FIELDS } from '../constants/fields';

export const getEmployeeColumns = (
  onEdit: (employee: IEmployee) => void,
  onDelete: (id: string) => void
): ColumnType<IEmployee>[] => {
  return [
    {
      title: UI_FIELDS.name,
      dataIndex: 'name',
      key: 'name',
      sorter: sortbyName,
      sortDirections: SortOrderType,
    },
    {
      title: UI_FIELDS.date,
      dataIndex: 'date',
      key: 'date',
      render: (stringDate: string) =>
        stringDate ? dayjs(stringDate, DATE_FORMAT).format(DATE_FORMAT) : '',
      sorter: sortByDate,
      sortDirections: SortOrderType,
    },
    {
      title: UI_FIELDS.salary,
      dataIndex: 'salary',
      key: 'salary',
      sorter: sortBySalary,
      sortDirections: SortOrderType,
    },
    {
      title: UI_FIELDS.actions,
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
