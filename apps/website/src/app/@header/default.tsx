import { HeaderMenu, type MenuItem } from "./_utils";

const menu = [
  {
    title: "Pazienti",
    url: "/pazienti",
  },
  {
    title: "Terapeuti",
    url: "/terapeuti",
  },
  {
    title: "Overview",
    url: "#features",
  },
  {
    title: "Benefici",
    url: "#benefits",
  },
  {
    title: "Contatti",
    url: "#contacts",
  },
] satisfies MenuItem[];

export default function Header() {
  return <HeaderMenu items={menu} />;
}
