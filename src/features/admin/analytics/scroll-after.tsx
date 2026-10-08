"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * İlk `count` satır görünür, gerisi kutunun içinde kayar. Satır yüksekliği
 * ekrana göre değiştiği için sabit yükseklik yerine ölçülür (ResizeObserver).
 */
export function ScrollAfter({
  count,
  className,
  children,
}: {
  count: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [maxHeight, setMaxHeight] = useState<number>();

  useLayoutEffect(() => {
    const list = ref.current;
    if (!list) return;
    const measure = () => {
      const next = list.children[count] as HTMLElement | undefined;
      // Liste `relative` olduğu için satırın offsetTop'u listeye göredir.
      setMaxHeight(next ? next.offsetTop : undefined);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [count]);

  return (
    <ul ref={ref} className={`relative ${className ?? ""}`} style={{ maxHeight, overflowY: maxHeight ? "auto" : undefined }}>
      {children}
    </ul>
  );
}
