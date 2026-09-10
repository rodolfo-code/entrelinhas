import type { LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

export type Section = {
  key: string;
  label: string;
  to: string;
  icon: LucideIcon;
  sidebarTitle: string;
  items: NavItem[];
};
