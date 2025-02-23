import { useRef, useEffect } from "react";

// type UseOutsideClick<T> = (
//   close: () => void,
//   listenCapturing?: boolean,
// ) => React.MutableRefObject<T | null>;

export const useOutsideClick = <T extends HTMLElement>(
	close: () => void,
	listenCapturing = true,
) => {
	const ref = useRef<T | null>(null);

	useEffect(() => {
		function handleClick(e: globalThis.MouseEvent | globalThis.KeyboardEvent) {
			if (e instanceof window.KeyboardEvent) {
				if (e.key !== "Escape") {
					return;
				} else {
					close();
				}
			}

			if (ref.current && !ref.current?.contains(e.target as Node)) {
				console.log("focus outside");
				close();
			}
		}
		//
		document.addEventListener("click", handleClick, listenCapturing);
		document.addEventListener("keydown", handleClick, listenCapturing);

		return () => {
			document.removeEventListener("click", handleClick, listenCapturing);
			document.removeEventListener("keydown", handleClick, listenCapturing);
		};
	}, [close, listenCapturing]);

	return ref;
};
