import React from 'react'

const Shader = ({ isOpen, onClick }: { isOpen: boolean, onClick: () => void }) => {
    return (
        <div onClick={onClick}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 left-0 w-[90%] bg-black/10 ${isOpen ? "z-10" : "-z-10"
                }`}
        />
        // <div className={` ${isOpen ? 'z-10' : 'z-0' } absolute w-[90%] h-screen bg-neutral-100/10  whitespace-pre`}> </div>
    )
}

export default Shader