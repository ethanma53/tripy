import { BalanceEntry, BalanceMap, Expense, Member } from '@/types';

/**
 * Compute net balances from a list of expenses.
 * Returns a simplified list of who owes whom after netting out mutual debts.
 */
export function computeBalances(members: Member[], expenses: Expense[]): BalanceEntry[] {
  // net[a][b] = amount that `a` owes `b` (positive means a owes b)
  const net: BalanceMap = {};

  for (const member of members) {
    net[member.id] = {};
    for (const other of members) {
      if (other.id !== member.id) {
        net[member.id][other.id] = 0;
      }
    }
  }

  for (const expense of expenses) {
    const shareCount = expense.splits.length;
    for (const split of expense.splits) {
      if (split.memberId === expense.paidById) continue;
      // For equal splits, use exact division to prevent rounding bias accumulation.
      // The rounded splits in computeEqualSplits are still used for per-expense display.
      const owedAmount =
        expense.splitType === 'equal'
          ? expense.amount / shareCount
          : split.amount;
      if (net[split.memberId] && net[split.memberId][expense.paidById] !== undefined) {
        net[split.memberId][expense.paidById] += owedAmount;
      }
      if (net[expense.paidById] && net[expense.paidById][split.memberId] !== undefined) {
        net[expense.paidById][split.memberId] -= owedAmount;
      }
    }
  }

  // Simplify: only keep positive net amounts (a owes b)
  const entries: BalanceEntry[] = [];
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));

  const seen = new Set<string>();
  for (const fromId of Object.keys(net)) {
    for (const toId of Object.keys(net[fromId])) {
      const key = [fromId, toId].sort().join(':');
      if (seen.has(key)) continue;
      seen.add(key);

      const amount = Math.round(net[fromId][toId] * 100) / 100;

      if (Math.abs(amount) <= 0.01) continue;

      const actualFrom = amount > 0 ? fromId : toId;
      const actualTo = amount > 0 ? toId : fromId;

      entries.push({
        fromId: actualFrom,
        fromName: memberMap[actualFrom]?.name ?? 'Unknown',
        toId: actualTo,
        toName: memberMap[actualTo]?.name ?? 'Unknown',
        amount: Math.abs(amount),
      });
    }
  }

  return entries;
}

export function computeEqualSplits(amount: number, memberIds: string[]) {
  if (memberIds.length === 0) return [];
  const perPerson = Math.round((amount / memberIds.length) * 100) / 100;
  const splits = memberIds.map((memberId, i) => ({
    memberId,
    // Adjust last person to account for rounding
    amount:
      i === memberIds.length - 1
        ? Math.round((amount - perPerson * (memberIds.length - 1)) * 100) / 100
        : perPerson,
  }));
  return splits;
}
