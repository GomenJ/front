import { useAuthStore } from "@/stores/auth-store";
import { Link } from "@tanstack/react-router";
import { Calculator, Home, ChartSpline } from "lucide-react";
// import {use} from "../store/authStore";

// import { Home, CalendarDays, Warehouse, Settings, Users } from "lucide-react";

export const MainNav = () => {
	const user = useAuthStore((state) => state.user);
	return (
		<nav>
			<ul className="hide-scrollbar flex flex-col gap-3 overflow-scroll">
				<li>
					<Link to="/" className="link">
						<Home />
						<span>Home</span>
					</Link>
				</li>

				{user?.role === "admin" ? (
					<li>
						<Link to="/cargar-curva-forward" className="link">
							<ChartSpline />
							<span>Cargar curva forward</span>
						</Link>
					</li>
				) : null}
				<li>
					<Link to="/cotizadora-de-gas" className="link">
						<Calculator />
						<span>Cotizadora de gas</span>
					</Link>
				</li>
			</ul>
		</nav>
	);
};

// <li>
//   <Link to="/dashboard" className="link">
//     {/* <Home /> */}
//     <span>Home</span>
//   </Link>
// </li>
// <li>
//   <Link
//     to="/bookings"
//     search={(prev) => ({ ...prev, sortBy: "startDate-asc" })}
//     className="link"
//   >
//     <CalendarDays />
//     <span>Bookings</span>
//   </Link>
// </li>
// <li>
//   <Link to="/cabins" className="link">
//     <Warehouse />
//     <span>Cabins</span>
//   </Link>
// </li>
// <li>
//   <Link to="/users" className="link">
//     <Users />
//     <span>Users</span>
//   </Link>
// </li>
