import type { Item } from "@/types";

interface ItemChipsProps {
  items: Item[];
}

export default function ItemChips({ items }: ItemChipsProps) {
  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.name}
          style={item.confidence === "low" ? { opacity: 0.5 } : undefined}
        >
          {item.name} ({item.quantity})
          {item.confidence === "low" && (
            <span title="Low confidence detection"> ?</span>
          )}
        </li>
      ))}
    </ul>
  );
}
