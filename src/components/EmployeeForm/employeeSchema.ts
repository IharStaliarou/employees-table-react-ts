import dayjs from 'dayjs';
import { z } from 'zod';
import { DATE_FORMAT } from '../../shared/constants';

export const employeeSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Имя должно содержать не менее 2 символов' }),
  date: z.string().refine(
    (val) => {
      return dayjs(val, DATE_FORMAT, true).isValid();
    },
    { message: 'Дата должна быть в формате ДД.ММ.ГГГГ' }
  ),
  salary: z
    .number({ error: 'Поле не может быть пустым' })
    .min(0, { message: 'Значение должно быть неотрицательным' }),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
