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
      title: "Costi",
      url: "#price",
      active: isActive("price"),
    },
    {
      title: "Efficacia",
      url: "#efficacy",
      active: isActive("efficacy"),
    },
  ] satisfies MenuItem[];
  return <HeaderMenu items={menu} />;
}
