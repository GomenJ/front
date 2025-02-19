import { LoaderCircleIcon } from "lucide-react"

export const Loader = ({ size = 80 }) => {
    return (
        <>
            <LoaderCircleIcon size={size}
                className="mx-auto my-auto h-full animate-spin text-center text-indigo-500"
            />
        </>
    )
}
