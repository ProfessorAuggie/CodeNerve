'use client';

import React from 'react';
import NextLink from 'next/link';
import { 
  useRouter, 
  usePathname, 
  useSearchParams as useNextSearchParams, 
  useParams as useNextParams 
} from 'next/navigation';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to?: string;
  href?: string;
  children?: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ to, href, children, ...props }) => {
  const target = to || href || '#';
  const isExternal = target.startsWith('http://') || target.startsWith('https://');

  if (isExternal) {
    return (
      <a href={target} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={target} {...props}>
      {children}
    </NextLink>
  );
};

export const useNavigate = () => {
  const router = useRouter();
  return (path: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };
};

export const useLocation = () => {
  const pathname = usePathname();
  let search = '';
  if (typeof window !== 'undefined') {
    search = window.location.search || '';
  }
  return {
    pathname: pathname || '/',
    search,
    hash: '',
    state: null as any,
  };
};

export const useParams = <T extends Record<string, string | string[]>>() => {
  const params = useNextParams();
  return (params || {}) as T;
};

export const useSearchParams = () => {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = (params: Record<string, string> | URLSearchParams) => {
    const nextQuery = new URLSearchParams(params as any);
    router.push(`${pathname}?${nextQuery.toString()}`);
  };

  return [searchParams, setSearchParams] as const;
};
