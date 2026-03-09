"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { ReactNode, forwardRef } from "react";

function supportsViewTransitions() {
  return typeof document !== "undefined" && "startViewTransition" in document;
}

interface LinkProps extends NextLinkProps {
  children?: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  function TransitionLink({ href, children, onClick, ...props }, ref) {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      const navigate = () => {
        router.push(href.toString());
      };

      if (supportsViewTransitions()) {
        document.startViewTransition(navigate);
      } else {
        navigate();
      }

      if (onClick) {
        onClick(e);
      }
    };

    return (
      <NextLink
        href={href}
        onClick={handleClick}
        ref={ref}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
);

export function useViewTransition() {
  const pathname = usePathname();

  useEffect(() => {
    if (!supportsViewTransitions()) return;
    // View transition is handled in the Link component
  }, [pathname]);
}
