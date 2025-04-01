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
	{ username: "generico", password: "5QF8goH4LqbPL0#mGg", role: "user" },
	{ username: "lupita", password: "lc^0$Zsyx0EBZi@48L", role: "user" },
	{ username: "monse", password: "RarLcz0qvV@APF$%88", role: "user" },
	{ username: "jose", password: "PPqmTI2Hpn%&m^W9l%", role: "user" },
	{ username: "miguel", password: "UG3F8$NXejn*fZTxRD", role: "user" },
	{ username: "alonso", password: "Strs!e3umK@0C&xpLq", role: "user" },
	{ username: "martin", password: "hgSNa$nih6Xp&3bd#W", role: "user" },
	{ username: "diego", password: "miSqXFdSW4$^D5gMu4", role: "user" },
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
