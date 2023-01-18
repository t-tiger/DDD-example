export type Customer = {
  id: number
  name: string;
  birth: Date
};

export const baseTicketPrice = (customer: Pick<Customer, 'birth'>): number => {
  // TODO
  return 1800
}