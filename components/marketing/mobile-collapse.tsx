"use client";

import { useEffect, useState } from "react";

// On phones, long detail folds behind one button so the page stays
// scannable. The content is in the server HTML (open) either way: it only
// collapses after load on narrow screens.
export function MobileCollapse({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [narrow, setNarrow] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const apply = () => {
      setNarrow(mq.matches);
      setOpen(!mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div>
      {narrow && (
        <button
          type="button"
          className="vs-more-btn"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Hide the list" : label}
          <span aria-hidden="true" className="vs-more-icon" data-open={open} />
        </button>
      )}
      <div hidden={narrow && !open} className={narrow ? "mt-3" : undefined}>
        {children}
      </div>
    </div>
  );
}
