import { cacheLife } from "next/cache";
import Nav, { type NavLink } from "@/components/Nav";
import Logo from "@/components/Logo";

const exploreLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/items", label: "Browse items" },
];

const accountLinks: NavLink[] = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/profile", label: "Profile" },
];

// cacheComponents is on, so new Date() can't run directly during prerender.
// Caching it keeps the footer static while still refreshing the year daily.
async function CopyrightYear() {
    "use cache";
    cacheLife("days");
    return <>{new Date().getFullYear()}</>;
}

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-line bg-white">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[2fr_1fr_1fr] md:py-12">
                <div className="flex flex-col gap-2">
                    <Logo className="w-fit" />
                    <p className="max-w-xs text-sm text-muted">
                        Borrow what you need. Share what you have. A neighborhood lending
                        library for Maple Grove.
                    </p>
                </div>

                <div>
                    <h2 className="px-3 text-sm font-bold text-ink">Explore</h2>
                    <Nav
                        links={exploreLinks}
                        label="Explore"
                        orientation="vertical"
                        className="mt-2"
                    />
                </div>

                <div>
                    <h2 className="px-3 text-sm font-bold text-ink">Account</h2>
                    <Nav
                        links={accountLinks}
                        label="Account"
                        orientation="vertical"
                        className="mt-2"
                    />
                </div>
            </div>

            <div className="border-t border-line">
                <p className="mx-auto max-w-6xl px-4 py-4 text-sm text-muted sm:px-6">
                    &copy; <CopyrightYear /> ShelfShare. All rights reserved.
                </p>
            </div>
        </footer>
    );
}