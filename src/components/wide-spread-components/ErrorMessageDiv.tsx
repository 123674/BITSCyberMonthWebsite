import { IoInformationCircleOutline } from "react-icons/io5";

const ErrorMessageDiv = ({ message, textSize, color = "#fb2c36" }: { message: string, textSize: number, color?: string }) => {
    return (
        <div className={`flex gap-1 font-light`} style={{ fontSize: `${textSize}px`, color: color }}>
            <div className="mt-1">
                <IoInformationCircleOutline size={textSize} />
            </div>
            <p>{message}</p>
        </div>
    )
}

export default ErrorMessageDiv