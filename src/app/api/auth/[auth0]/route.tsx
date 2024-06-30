
import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
    login: handleLogin({
        authorizationParams: {
          prompt: "login",
        },
        returnTo: process.env.CHAT_URL,
      }),
    logout: handleLogout({
        returnTo: process.env.URL,
      }),
});
