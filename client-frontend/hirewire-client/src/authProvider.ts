import type { AuthProvider, OnErrorResponse } from "@refinedev/core";

export const TOKEN_KEY = "refine-auth";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const request = new Request("http://localhost:3000/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    const response = await fetch(request);

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem(TOKEN_KEY, token.accessToken);
      return { success: true, redirectTo: "/home" };
    }

    return {
      success: false,
      error: { name: "LoginError", message: "Invalid credentials" },
    };
  },

  register: async ({ email, firstName, password, documentId, lastName }) => {
    try {
      const response = await fetch(`http://localhost:3000/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          documentId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error registering user");
      }

      const data = await response.json();

      if (!data) {
        throw new Error();
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "RegistrationError",
          message: "Error while registering user",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    await sleep(500);

    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/login" };
  },

  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      return { id: 1, name: "User", avatar: "https://i.pravatar.cc/300" };
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    if (error?.status === 401) {
      return {
        logout: true,
        error: { message: "Unauthorized" },
      } as unknown as Promise<OnErrorResponse>;
    }
    return { error };
  },
};
