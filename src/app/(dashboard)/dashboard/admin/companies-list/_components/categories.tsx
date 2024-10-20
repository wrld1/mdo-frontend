"use client";

import {
  CircleCheck,
  CircleDashed,
  Hourglass,
  ShieldMinus,
} from "lucide-react";
import { CategoryItem } from "./category-item";

const items = [
  {
    title: "Обробляються",
    icon: CircleDashed,
    value: "PENDING",
  },
  {
    title: "Оброблені",
    icon: CircleCheck,
    value: "PROCESSED",
  },
  {
    title: "Неактивні",
    icon: Hourglass,
    value: "INACTIVE",
  },
  {
    title: "Заблоковані",
    icon: ShieldMinus,
    value: "BLOCKED",
  },
];

export function Categories() {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2 justify-center">
      {items.map((item) => (
        <CategoryItem
          key={item.value}
          label={item.title}
          icon={item.icon}
          value={item.value}
        />
      ))}
    </div>
  );
}
