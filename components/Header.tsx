import Nav, { type NavLink } from "@/components/Nav";
import AuthLinks, { type HeaderUser } from "@/components/AuthLinks";
import MobileMenu from "@/components/MobileMenu";
import Logo from "@/components/Logo";

const publicLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/items", label: "Browse" },
];

const signedInLinks: NavLink[] = [
    ...publicLinks,
    { href: "/dashboard", label: "Dashboard" },
];

interface HeaderProps {
    user?: HeaderUser | null;
    signOutAction?: () => Promise<void>;
}

export default function Header({ user = null, signOutAction }: HeaderProps) {
    const links = user ? signedInLinks : publicLinks;

    return (
        <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:font-semibold focus:text-brand focus:outline-2 focus:outline-brand"
            >
                Skip to main content
            </a>

            <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                <Logo />

                {/* Desktop */}
                <div className="hidden md:flex md:flex-1 md:items-center md:justify-between md:gap-6">
                    <Nav links={links} label="Main" />
                    <AuthLinks user={user} signOutAction={signOutAction} />
                </div>

                {/* Mobile */}
                <MobileMenu links={links}>
                    <AuthLinks
                        user={user}
                        signOutAction={signOutAction}
                        orientation="vertical"
                    />
                </MobileMenu>
            </div>
        </header>
    );
}