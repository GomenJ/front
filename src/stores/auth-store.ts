import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "user" | "admin";

export type User = {
	username: string;
	password: string;
	role: Role;
};

interface AuthState {
	user: { username: string; role: Role } | null;
	login: (username: string, password: string) => boolean;
	logout: () => void;
}

const fakeUsers: User[] = [
	{ username: "edgar", password: "8Uqr5nosPXXg8Im5K#", role: "admin" },
	{ username: "david", password: "3yQbz@Cy01nVgxQKaK", role: "admin" },
	{ username: "becario", password: "30i65BsMdJtRg^e22&", role: "admin" },
	{ username: "lupita", password: "lc^0$Zsyx0EBZi@48L", role: "user" },
	{ username: "monse", password: "m@XVCLDQcEv6Nyq4!2", role: "user" },
	// {kl}
];

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			login: (username, password) => {
				const foundUser = fakeUsers.find(
					(user) => user.username === username && user.password === password,
				);

				if (foundUser) {
					set({ user: { username: foundUser.username, role: foundUser.role } });
					return true;
				}
				return false;
			},
			logout: () => set({ user: null }),
		}),
		{ name: "auth-storage" },
	),
);
