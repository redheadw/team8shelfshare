"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export interface NavLink {
    href: string;
    label: string;
    /** Only mark active on an exact match */
    exact?: boolean;
}

interface NavProps {
    links: NavLink[];
    /** Accessible name for the <nav> landmark, e.g. "Main" or "Footer". */
    label?: string;
    orientation?: "horizontal" | "vertical";
    className?: string;
    /** Called after a link navigates. Only usable from client components (e.g. to close a mobile menu). */
    onNavigate?: () => void;
}

function isActivePath(pathname: string | null, link: NavLink): boolean {
    if (!pathname) return false;
    if (link.href === "/" || link.exact) return pathname === link.href;
    return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

function NavList({
    links,
    label = "Main",
    orientation = "horizontal",
    className = "",
    onNavigate,
    pathname,
}: NavProps & { pathname: string | null }) {
    const listClasses =
        orientation === "horizontal"
            ? "flex items-center gap-1"
            : "flex flex-col gap-1";

    return (
        <nav aria-label={label} className={className}>
            <ul className={listClasses}>
                {links.map((link) => {
                    const isActive = isActivePath(pathname, link);
                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                onNavigate={onNavigate}
                                aria-current={isActive ? "page" : undefined}
                                className={`flex min-h-11 items-center rounded-lg px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${isActive
                                    ? "bg-brand-light font-semibold text-brand-dark"
                                    : "font-medium text-muted hover:bg-brand-light hover:text-ink"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

function ActiveNavList(props: NavProps) {
    const pathname = usePathname();
    return <NavList {...props} pathname={pathname} />;
}

export default function Nav(props: NavProps) {
    // cacheComponents is on, so usePathname needs a Suspense boundary.
    // The fallback renders the same links without the active highlight.
    return (
        <Suspense fallback={<NavList {...props} pathname={null} />}>
            <ActiveNavList {...props} />
        </Suspense>
    );
}