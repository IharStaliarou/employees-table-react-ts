import dayjs from 'dayjs';

import type { IEmployee } from '../types/employee.interface';
import { DATE_FORMAT } from '../constants';

export const sortbyName = (a: IEmployee, b: IEmployee) =>
  a.name.localeCompare(b.name);

export const sortByDate = (a: IEmployee, b: IEmployee) =>
  dayjs(a.date, DATE_FORMAT).valueOf() - dayjs(b.date, DATE_FORMAT).valueOf();

export const sortBySalary = (a: IEmployee, b: IEmployee) => a.salary - b.salary;
