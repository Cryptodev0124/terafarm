/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementType } from "react";
import { DropdownMenuItemType } from "widgets/Menu";

export interface BottomNavItemProps {
  label: string;
  href: string;
  disabled?: boolean;
  icon?: ElementType<any>;
  fillIcon?: ElementType<any>;
  isActive?: boolean;
  showItemsOnMobile?: boolean;
  type?: DropdownMenuItemType;
}
