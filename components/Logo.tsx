import Link from "next/link";
import { LibraryBig } from "lucide-react";

interface LogoProps {
    className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
    return (
        <Link
            href="/"
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg font-heading text-xl font-extrabold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
        >
            <LibraryBig aria-hidden="true" size={24} className="text-brand" />
            <span>
                <span className="text-brand">Shelf</span>
                <span className="text-ink">Share</span>
            </span>
        </Link>
    );
}