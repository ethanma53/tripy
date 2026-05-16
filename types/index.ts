export interface Member {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Member[];
  createdAt: string;
}

export type SplitType = 'equal' | 'custom';

export interface Split {
  memberId: string;
  amount: number;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  paidById: string;
  splitType: SplitType;
  splits: Split[];
  createdAt: string;
}

// memberId → (memberId → amount they owe)
export type BalanceMap = Record<string, Record<string, number>>;

export interface BalanceEntry {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
}
