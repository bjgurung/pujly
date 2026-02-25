import { httpLink, createTRPCClient } from "@trpc/client";
import superjson from "superjson";

const getBaseUrl = () => {
  const url = process.env.EXPO_PUBLIC_RORK_API_BASE_URL;

  if (!url) {
    console.warn('[TRPC] EXPO_PUBLIC_RORK_API_BASE_URL is not set, using fallback');
    return 'https://fallback.invalid';
  }

  return url;
};

let getAuthToken: (() => string | null) | null = null;

export function setAuthTokenGetter(getter: () => string | null) {
  getAuthToken = getter;
}

export const trpcClient = createTRPCClient<any>({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      async headers() {
        const token = getAuthToken ? getAuthToken() : null;
        return {
          Authorization: token ? `Bearer ${token}` : undefined,
        };
      },
    }),
  ],
});