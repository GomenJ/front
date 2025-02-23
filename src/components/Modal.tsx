import { useOutsideClick } from "@/hooks/useOutsideClick";
import { XIcon } from "lucide-react";
import { createContext, createElement, useContext, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
	children: React.ReactNode;
}

type ModalContextType = {
	open: (name: string) => void;
	openName: string;
	close: () => void;
};

// type ModalWindowProps = Pick<ModalProps, "children"> & {
//   name: string;
// };

type ModalWindowProps = {
	render?: (close: () => void) => React.ReactNode;
	name: string;
};

const ModalContext = createContext<ModalContextType>(null!);

export function Modal({ children }: ModalProps) {
	const [openName, setOpenName] = useState("");

	const close = () => {
		setOpenName("");
	};

	const open = (name: string) => setOpenName(name);
	return (
		<ModalContext.Provider value={{ open, openName, close }}>
			{children}
		</ModalContext.Provider>
	);
}

function Open({
	children,
	opens: opensWindowName,
}: {
	children: React.ReactElement;
	opens: string;
}) {
	const { open } = useContext(ModalContext);

	// First way to do it
	// Clone the children element and add the onClick but it's not recommended
	// return cloneElement(children, {
	//   ...children.props,
	//   onClick: () => open(opensWindowName),
	// });
	// second way to do it
	// Create a new element with the same type and props and add the onClick event, this is better than the first way
	return createElement(children.type, {
		...children.props,
		onClick: () => open(opensWindowName),
	});
}

const Window = ({ render, name }: ModalWindowProps) => {
	const { openName, close } = useContext(ModalContext);
	// This is jonas example
	const ref = useOutsideClick<HTMLDivElement>(close);
	// but we could do it also like this
	// const ref = useRef<HTMLDivElement | null>(null);
	// const ref = useOutsideClick(ref, close);
	if (name !== openName) return;

	return createPortal(
		<div className="fixed left-0 top-0 z-10 h-screen w-full bg-[--backdrop-color] backdrop-blur-sm transition-all delay-500">
			<div
				ref={ref}
				className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-10 py-8 shadow-lg transition-all delay-500 dark:bg-gray-800"
			>
				<button
					onClick={() => {
						close();
					}}
					className="rounder-sm absolute right-5 top-3 translate-x-2 border-0 bg-none p-1 transition-all delay-500"
				>
					<XIcon />
				</button>
				<div>{render?.(close)}</div>
			</div>
		</div>,
		document.body,
	);
};

Modal.Open = Open;
Modal.Window = Window;
