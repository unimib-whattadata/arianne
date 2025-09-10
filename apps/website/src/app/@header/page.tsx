"use client";

import { useInViewObserver } from "../_context/in-view-observer";
import { HeaderMenu, type MenuItem } from "./_utils";

export default function Header() {
  const { visibleSection } = useInViewObserver();

  const isActive = (id: string) => {
    return visibleSection === id;
  };

  const menu = [
    {
      title: "Overview",
      url: "#features",
      active: isActive("features"),
    },
    {
      title: "Benefici",
      url: "#benefits",
      active: isActive("benefits"),
    },
    {
      title: "Collaborazioni",
      url: "#collaboration",
      active: isActive("collaboration"),
    },
    {
      title: "Contatti",
      url: "#contacts",
      active: isActive("contacts"),
    },
  ] satisfies MenuItem[];

  return <HeaderMenu items={menu} />;
}
