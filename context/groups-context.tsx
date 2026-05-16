import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Group, Member } from '@/types';
import { loadGroups, saveGroups } from '@/storage/groups';
import { generateId } from '@/utils/id';

// ── State ──────────────────────────────────────────────────────────────────

interface GroupsState {
  groups: Group[];
  loaded: boolean;
}

// ── Actions ────────────────────────────────────────────────────────────────

type GroupsAction =
  | { type: 'LOAD'; payload: Group[] }
  | { type: 'ADD_GROUP'; payload: { name: string; members: string[] } }
  | { type: 'DELETE_GROUP'; payload: { groupId: string } };

function groupsReducer(state: GroupsState, action: GroupsAction): GroupsState {
  switch (action.type) {
    case 'LOAD':
      return { groups: action.payload, loaded: true };

    case 'ADD_GROUP': {
      const members: Member[] = action.payload.members.map((name) => ({
        id: generateId(),
        name: name.trim(),
      }));
      const newGroup: Group = {
        id: generateId(),
        name: action.payload.name.trim(),
        members,
        createdAt: new Date().toISOString(),
      };
      return { ...state, groups: [newGroup, ...state.groups] };
    }

    case 'DELETE_GROUP':
      return {
        ...state,
        groups: state.groups.filter((g) => g.id !== action.payload.groupId),
      };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface GroupsContextValue {
  groups: Group[];
  loaded: boolean;
  addGroup: (name: string, members: string[]) => void;
  deleteGroup: (groupId: string) => void;
  getGroup: (groupId: string) => Group | undefined;
}

const GroupsContext = createContext<GroupsContextValue | null>(null);

export function GroupsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(groupsReducer, { groups: [], loaded: false });

  // Load from storage on mount
  useEffect(() => {
    loadGroups().then((groups) => dispatch({ type: 'LOAD', payload: groups }));
  }, []);

  // Persist whenever groups change (skip initial empty load)
  useEffect(() => {
    if (state.loaded) {
      saveGroups(state.groups);
    }
  }, [state.groups, state.loaded]);

  const value: GroupsContextValue = {
    groups: state.groups,
    loaded: state.loaded,
    addGroup: (name, members) => dispatch({ type: 'ADD_GROUP', payload: { name, members } }),
    deleteGroup: (groupId) => dispatch({ type: 'DELETE_GROUP', payload: { groupId } }),
    getGroup: (groupId) => state.groups.find((g) => g.id === groupId),
  };

  return <GroupsContext.Provider value={value}>{children}</GroupsContext.Provider>;
}

export function useGroups() {
  const ctx = useContext(GroupsContext);
  if (!ctx) throw new Error('useGroups must be used within GroupsProvider');
  return ctx;
}
