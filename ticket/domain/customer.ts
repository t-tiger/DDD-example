import { Customer } from "@prisma/client";

export const customerAgeOnDate = ({ birth }: Pick<Customer, "birth">, date: Date) => {
  if (date < birth) {
    return 0;
  }
  const diffMs = date.getTime() - birth.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};
