import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BrowseAllButtonProps {
  href?: string;
  label?: string;
  id?: string;
  className?: string;
}


export default function BrowseAllButton({
  href = "/category/all",
  label = "Browse All",
  id,
  className = "",
}: BrowseAllButtonProps) {
  return (
    <Link href={href} id={id} className={`btn-browse-all ${className}`}>
      {label}
      <ChevronRight size={14} strokeWidth={2.5} />
    </Link>
  );
}
