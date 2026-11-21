"use client";

import {
    useEffect,
    useId,
    useRef,
    useState,
    type MouseEvent,
    type ReactNode,
} from "react";
import { Menu, X } from "lucide-react";
import Nav, { type NavLink } from "@/components/Nav";

interface MobileMenuProps {
    links: NavLink[];
    /** Extra content under the nav (the server-rendered AuthLinks). */
    children?: ReactNode;
}

export default function MobileMenu({ links, children }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const panelId = useId();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const closeMenu = () => setIsOpen(false);

    // Close with Escape and return focus to the toggle button.
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
                buttonRef.current?.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Close when any link inside the extra content is activated.
    function handleChildrenClick(event: MouseEvent<HTMLDivElement>) {
        if ((event.target as HTMLElement).closest("a")) closeMenu();
    }

    return (
        <div className="md:hidden">
            <button
                ref={buttonRef}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setIsOpen((open) => !open)}
                className="inline-flex size-11 items-center justify-center rounded-lg text-ink transition-colors hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
                <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
                {isOpen ? (
                    <X aria-hidden="true" size={20} />
                ) : (
                    <Menu aria-hidden="true" size={20} />
                )}
            </button>

            <div
                id={panelId}
                hidden={!isOpen}
                className="absolute inset-x-0 top-full border-b border-line bg-white px-4 pb-4 pt-2 shadow-md"
            >
                <Nav
                    links={links}
                    label="Main"
                    orientation="vertical"
                    onNavigate={closeMenu}
                />
                <div
                    onClick={handleChildrenClick}
                    className="mt-2 border-t border-line pt-3"
                >
                    {children}
                </div>
            </div>
        </div>
    );
}