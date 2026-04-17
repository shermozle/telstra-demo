import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefix a public-folder path with the Next.js basePath. Required for plain
 * `<img>` tags under a non-root deploy (e.g. GitHub project Pages), since Next
 * only auto-prefixes `<Image>` and `<Link>`. Pass paths that start with `/`.
 */
export function assetPath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
