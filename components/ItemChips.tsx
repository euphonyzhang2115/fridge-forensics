import type { Item } from "@/types";

interface ItemChipsProps {
  items: Item[];
}

export default function ItemChips({ items }: ItemChipsProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item.name}
          className={`inline-flex items-center gap-1 rounded-full border border-[color:var(--border-subtle)] bg-card px-3 py-1 text-base font-normal ${
            item.confidence === "low" ? "opacity-50" : ""
          }`}
        >
          {item.name} ({item.quantity})
          {item.confidence === "low" && (
            <span
              title="Low confidence detection"
              className="font-bold text-accent"
            >
              ?
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
