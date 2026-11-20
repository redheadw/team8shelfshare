import type { RequestStatus } from "@/lib/types";

// Colors from the team's design system; each pair meets WCAG AA contrast.
const STATUS_STYLES: Record<RequestStatus, { label: string; classes: string }> =
  {
    pending: { label: "Pending", classes: "bg-amber-50 text-amber-700" },
    approved: { label: "Approved", classes: "bg-green-50 text-green-700" },
    declined: { label: "Declined", classes: "bg-red-50 text-red-700" },
    returned: { label: "Returned", classes: "bg-sky-50 text-sky-700" },
    cancelled: { label: "Cancelled", classes: "bg-stone-100 text-stone-600" },
  };

export default function StatusBadge({ status }: { status: RequestStatus }) {
  const { label, classes } = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}
