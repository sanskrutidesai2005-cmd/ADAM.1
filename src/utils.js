import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const createPageUrl = (pageName) => {
  return `/${pageName.toLowerCase()}`;
};

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
