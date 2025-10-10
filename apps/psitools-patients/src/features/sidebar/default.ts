import { useQuery } from '@tanstack/react-query';
import {
  CalendarDays,
  ClipboardList,
  Home,
  LifeBuoy,
  MessageCircle,
  NotebookPen,
  Settings,
  UserRound,
} from 'lucide-react';
import { useMemo } from 'react';

import { useTRPC } from '@/trpc/react';

import type { SibebarMenuItems } from './components/nav-main';

export const useMenu = (
  active?:
    | 'home'
    | 'calendario'
    | 'questionari'
    | 'diari'
    | 'assistenza'
    | 'profilo'
    | 'impostazioni'
    | 'chat',
) => {
  const api = useTRPC();

  const { data: assignments } = useQuery(api.assignments.get.queryOptions());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const administrationCount = useMemo(() => {
    return (
      assignments?.filter((a) => {
        const eventDate = new Date(a.date);
        eventDate.setHours(0, 0, 0, 0);
        return (
          a.type === 'administration' && eventDate.getTime() === today.getTime()
        );
      }).length || 0
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments]);

  const diaryCount = useMemo(() => {
    return (
      assignments?.filter((a) => {
        const eventDate = new Date(a.date);
        eventDate.setHours(0, 0, 0, 0);
        return a.type === 'diary' && eventDate.getTime() === today.getTime();
      }).length || 0
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments]);

  const NAV_MAIN = [
    {
      title: 'Home',
      url: '/',
      icon: Home,
      disabled: false,
      isActive: active === 'home',
    },
    {
      title: 'Calendario',
      url: '/calendario',
      icon: CalendarDays,
      disabled: false,
      isActive: active === 'calendario',
    },
  ] satisfies SibebarMenuItems['items'];

  const NAV_EXERCISE = [
    {
      title: 'Questionari',
      url: '/questionari',
      icon: ClipboardList,
      badge: administrationCount,
      isActive: active === 'questionari',
    },
    {
      title: 'Diari',
      url: '/diari',
      icon: NotebookPen,
      badge: diaryCount,
      isActive: active === 'diari',
    },
    {
      title: 'Chat',
      url: '/chat',
      icon: MessageCircle,
      isActive: active === 'chat',
    },
  ];

  const NAV_SECONDARY = [
    {
      title: 'Profilo',
      url: '/profilo',
      icon: UserRound,
      disabled: false,
      isActive: active === 'profilo',
    },
    {
      title: 'Impostazioni',
      url: '/impostazioni',
      icon: Settings,
      disabled: false,
      isActive: active === 'impostazioni',
    },
    {
      title: 'Assistenza',
      url: '#',
      icon: LifeBuoy,
      disabled: true,
      isActive: active === 'assistenza',
    },
  ];

  return {
    NAV_MAIN,
    NAV_SECONDARY,
    NAV_EXERCISE,
  };
};
