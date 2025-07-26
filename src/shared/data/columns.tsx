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
  onDelete: (id: string) => void,
  searchText: string
): ColumnType<IEmployee>[] => {
  const highlightText = (text: string | number) => {
    const textString = String(text);
    if (!searchText) {
      return textString;
    }
    const lowerCaseText = textString.toLowerCase();
    const lowerCaseSearchText = searchText.toLowerCase();
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    lowerCaseText.replace(
      new RegExp(lowerCaseSearchText, 'gi'),
      (match, offset) => {
        if (offset > lastIndex) {
          parts.push(textString.substring(lastIndex, offset));
        }
        parts.push(
          <mark key={offset} style={{ backgroundColor: '#fffb8f', padding: 0 }}>
            {textString.substring(offset, offset + match.length)}
          </mark>
        );
        lastIndex = offset + match.length;
        return match;
      }
    );

    if (lastIndex < textString.length) {
      parts.push(textString.substring(lastIndex));
    }
    return <>{parts}</>;
  };

  return [
    {
      title: UI_FIELDS.name,
      dataIndex: 'name',
      key: 'name',
      sorter: sortbyName,
      sortDirections: SortOrderType,
      render: (text: string) => highlightText(text),
    },
    {
      title: UI_FIELDS.date,
      dataIndex: 'date',
      key: 'date',
      render: (stringDate: string) =>
        highlightText(
          stringDate ? dayjs(stringDate, DATE_FORMAT).format(DATE_FORMAT) : ''
        ),
      sorter: sortByDate,
      sortDirections: SortOrderType,
    },
    {
      title: UI_FIELDS.salary,
      dataIndex: 'salary',
      key: 'salary',
      sorter: sortBySalary,
      sortDirections: SortOrderType,
      render: (text: number) => highlightText(text),
    },
    {
      title: UI_FIELDS.actions,
      key: 'actions',
      width: '300px',
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
