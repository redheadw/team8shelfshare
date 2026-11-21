import Link from "next/link";

export interface HeaderUser {
    name?: string | null;
    email?: string | null;
}

interface AuthLinksProps {
    user: HeaderUser | null;
    /** Server action that signs the user out (wired up once Auth.js is merged). */
    signOutAction?: () => Promise<void>;
    orientation?: "horizontal" | "vertical";
}

const focusRing =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
const base = `flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold transition-colors ${focusRing}`;
const primaryButton = `${base} justify-center bg-brand text-white hover:bg-brand-dark`;
const secondaryButton = `${base} justify-center border border-stone-300 bg-white text-ink hover:bg-stone-50`;
const textLink = `${base} text-muted hover:bg-brand-light hover:text-ink`;

export default function AuthLinks({
    user,
    signOutAction,
    orientation = "horizontal",
}: AuthLinksProps) {
    const layout =
        orientation === "horizontal"
            ? "flex items-center gap-2"
            : "flex flex-col gap-2";

    if (!user) {
        return (
            <div className={layout}>
                <Link href="/login" className={secondaryButton}>
                    Log in
                </Link>
                <Link href="/register" className={primaryButton}>
                    Register
                </Link>
            </div>
        );
    }

    const displayName = user.name || user.email || "My account";

    return (
        <div className={layout}>
            <Link href="/profile" className={textLink}>
                <span className="sr-only">Profile for </span>
                {displayName}
            </Link>
            {signOutAction && (
                <form action={signOutAction}>
                    <button type="submit" className={`${secondaryButton} w-full`}>
                        Sign out
                    </button>
                </form>
            )}
        </div>
    );
}