"use client";

import { useInViewObserver } from "~/app/_context/in-view-observer";
import { HeaderMenu, type MenuItem } from "../_utils";

export default function Header() {
  const { visibleSection } = useInViewObserver();

  const isActive = (id: string) => {
    return visibleSection === id;
  };

  const menu = [
    {
      title: "Funzionalità",
      url: "#features",
      active: isActive("features"),
    },
    {
      title: "Vantaggi",
      url: "#advantages",
      active: isActive("advantages"),
    },
    {
      title: "Costi",
      url: "#price",
      active: isActive("price"),
    },
    {
      title: "Info",
      url: "#info",
      active: isActive("info"),
    },
  ] satisfies MenuItem[];

  return <HeaderMenu items={menu} />;
}
