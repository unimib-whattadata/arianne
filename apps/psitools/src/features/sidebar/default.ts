import { useQuery } from '@tanstack/react-query';
import {
  Bell,
  BetweenHorizontalStart,
  BookHeart,
  Calendar1,
  // CircleHelp,
  FilePlus,
  LayoutDashboard,
  MessageCircle,
  NotepadText,
  Settings,
  UserRound,
  BookOpen,
} from 'lucide-react';
import { useMemo } from 'react';

import { useTRPC } from '@/trpc/react';

import type { SibebarMenuItems } from './components/nav-main';

export const useMenu = (active?: string) => {
  const api = useTRPC();
  const { data } = useQuery(api.notifications.all.queryOptions());

  const unreadCount = useMemo(() => {
    return data?.filter((n) => !n.read).length ?? 0;
  }, [data]);

  const NAV_MAIN = [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
      disabled: false,
    },
    {
      title: 'Pazienti',
      url: '/pazienti',
      icon: UserRound,
      disabled: false,
    },
    {
      title: 'Agenda',
      url: '/agenda',
      icon: Calendar1,
      disabled: false,
    },
    {
      title: 'Chats',
      url: '/chats',
      icon: MessageCircle,
      disabled: false,
    },
    {
      title: "Lista d'attesa",
      url: '/lista-attesa',
      icon: NotepadText,
      disabled: false,
    },
  ] satisfies SibebarMenuItems['items'];

  const NAV_SECONDARY = [
    // {
    //   title: 'Assistenza',
    //   url: '/assistenza',
    //   icon: CircleHelp,
    //   disabled: true,
    //   isActive: active === 'assistenza',
    // },

    {
      title: 'Impostazioni',
      url: '/impostazioni',
      icon: Settings,
      disabled: false,
      isActive: active === 'impostazioni',
    },
    {
      title: 'Notifiche',
      url: '/notifiche',
      icon: Bell,
      disabled: false,
      badge: unreadCount,
      isActive: active === 'notifiche',
    },
  ];

  return { NAV_MAIN, NAV_SECONDARY };
};

export const usePatientMenu = ({
  userId,
  active,
}: {
  userId: string;
  active?:
    | 'assegnazioni'
    | 'diari'
    | 'somministrazioni'
    | 'note'
    | 'referti'
    | 'modelli'
    | 'builder'
    | 'farmaci'
    | 'esercizi';
}) => {
  const api = useTRPC();
  const { data: user, isLoading } = useQuery(
    api.profiles.get.queryOptions(
      { id: userId },
      { enabled: !!userId, staleTime: Infinity },
    ),
  );

  const name = user?.name;

  const items = useMemo(() => {
    return [
      {
        title: 'Cartella clinica',
        url: `/pazienti/${userId}/cartella-clinica`,
        icon: LayoutDashboard,
      },
      {
        title: 'Assegnazioni',
        url: `/pazienti/${userId}/assegnazioni`,
        icon: UserRound,
        isActive:
          active === 'assegnazioni' ||
          active === 'diari' ||
          active === 'somministrazioni' ||
          active === 'farmaci' ||
          active === 'esercizi',
        items: [
          {
            title: 'Diari',
            url: `/diari`,
            icon: BookHeart,
            isActive: active === 'diari',
          },
          {
            title: 'Somministrazioni',
            url: `/somministrazioni`,
            isActive: active === 'somministrazioni',
            icon: NotepadText,
          },
          {
            title: 'Farmaci',
            url: `/farmaci`,
            isActive: active === 'farmaci',
            icon: UserRound,
          },
          {
            title: 'Esercizi',
            url: `/esercizi`,
            isActive: active === 'esercizi',
            icon: BookOpen,
          },
        ],
      },
      {
        title: 'Note',
        url: `/pazienti/${userId}/note`,
        icon: UserRound,
        isActive: active === 'note',
      },
      {
        title: 'Referti',
        url: `/pazienti/${userId}/referti`,
        icon: BookHeart,
        isActive:
          active === 'referti' || active === 'modelli' || active === 'builder',
        items: [
          {
            title: 'Modelli',
            url: `/modelli`,
            icon: FilePlus,
            isActive: active === 'modelli',
          },
          {
            title: 'Builder',
            url: `/builder/nuovo`,
            icon: BetweenHorizontalStart,
            isActive: active === 'builder',
          },
        ],
      },
    ];
  }, [userId, active]);

  return { isLoading, name, items };
};
