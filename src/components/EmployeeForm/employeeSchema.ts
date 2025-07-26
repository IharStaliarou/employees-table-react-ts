import dayjs from 'dayjs';
import { z } from 'zod';
import { DATE_FORMAT } from '../../shared/constants';

export const employeeSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Имя должно содержать не менее 2 символов' })
    .max(20, { message: 'Имя должно содержать не более 20 символов' })
    .regex(/^[А-Яа-яЁё\s-]+$/, {
      message: 'Имя может содержать только русские буквы, пробелы и дефисы',
    })
    .refine((val) => !/-{2,}/.test(val), {
      message: 'Имя не должно содержать более одного дефиса подряд',
    })
    .refine((val) => !val.endsWith(' ') && !val.endsWith('-'), {
      message: 'Имя не должно оканчиваться пробелом или дефисом',
    })
    .refine((val) => /^[А-ЯЁ]/.test(val), {
      message: 'Имя должно начинаться с заглавной буквы',
    }),
  date: z
    .string()
    .nonempty({ message: 'Дата не может быть пустой' })
    .refine(
      (val) => {
        const dateObj = dayjs(val, DATE_FORMAT, true);
        if (!dateObj.isValid()) {
          return false;
        }
        const eighteenYearsAgo = dayjs().subtract(18, 'year');
        return dateObj.isBefore(eighteenYearsAgo, 'day');
      },
      {
        message:
          'Дата должна быть строго в формате ДД.ММ.ГГГГ и сотруднику должно быть не менее 18 лет',
      }
    ),
  salary: z
    .number({ error: 'Поле не может быть пустым и должно быть числом' })
    .min(1, { message: 'Заработная плата должна быть не менее 1' })
    .max(100_000_000, {
      message: 'Заработная плата должна быть не более 100 000 000',
    }),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
