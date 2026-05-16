# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx expo start           # Start dev server (scan QR with Expo Go)
npx expo start --ios     # Launch in iOS simulator
npx expo start --android # Launch in Android emulator
npx expo start --web     # Launch in browser
expo lint                # Run ESLint
```

No test runner is configured.

## Architecture

**Tripy** is an Expo Router (file-based routing) React Native app for splitting trip expenses. All data is stored locally via AsyncStorage — no backend.

### State Management

Two React Contexts wrap the entire app via `AppProvider` in `app/_layout.tsx`:
- `GroupsContext` (`context/groups-context.tsx`) — manages trips, uses `useReducer`
- `ExpensesContext` (`context/expenses-context.tsx`) — manages expenses per trip, uses `useReducer`

Both contexts auto-persist to AsyncStorage on every state change (via `useEffect`). They load from storage on mount and set a `loaded` flag to prevent writing during initial hydration. Storage keys: `@tripy/groups`, `@tripy/expenses`.

### Routing

File-based with Expo Router. Entry: `app/index.tsx` redirects to `/(tabs)/expenses`.

Key routes:
- `app/(tabs)/_layout.tsx` — bottom tab navigator (3 tabs: Expenses, Places, Photos)
- `app/(tabs)/expenses/index.tsx` — list of groups/trips
- `app/(tabs)/expenses/new-group.tsx` — modal to create a trip
- `app/(tabs)/expenses/[groupId]/index.tsx` — group detail with Expenses/Balances tabs
- `app/(tabs)/expenses/[groupId]/add-expense.tsx` — modal to add an expense

### Data Models (`types/index.ts`)

```typescript
Group    { id, name, members: Member[], createdAt }
Member   { id, name }
Expense  { id, groupId, title, amount, paidById, splitType: 'equal'|'custom', splits: Split[], createdAt }
Split    { memberId, amount }
BalanceMap = Record<string, Record<string, number>>  // net debts between members
```

### Utilities

- `utils/balance.ts` — compute net balances (`computeBalances`) and equal splits (`computeEqualSplits`)
- `utils/currency.ts` — USD formatting
- `utils/id.ts` — ID generation (`${timestamp}-${randomString}`)

### UI Components

Base components in `components/ui/`: `Button`, `Input`, `Card`, `Avatar`, `EmptyState`, `IconSymbol` (platform-specific: `.ios.tsx` for SF Symbols, fallback for others).

Feature components in `components/expenses/`: `GroupCard`, `ExpenseItem`, `BalanceSummary`.

### Theming

`constants/theme.ts` exports `Colors` for light/dark mode. `useThemeColor` hook resolves the correct color. Components use `StyleSheet.create()` for styling.

## Key Conventions

- Path alias `@/` resolves to the project root
- TypeScript strict mode — no implicit `any`
- Platform-specific files: `*.ios.tsx`, `*.web.ts`
- IDs: custom format `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
- Floating action buttons positioned absolutely at bottom-right
