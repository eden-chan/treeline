
export const PinCustomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor">
        <path
            d="m6 2.58 2.89 2.9a2.64 2.64 0 0 0 3.37.3l.37.37-3.08 3.07 3.77 3.76v.34h-.34L9.21 9.56 6.16 12.6l-.37-.37a2.64 2.64 0 0 0-.3-3.36l-2.9-2.89-.85.85a.24.24 0 0 1-.34-.34l5.1-5.1c.1-.09.25-.09.34 0 .1.1.1.25 0 .35L6 2.58Z"
            // stroke-width="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="currentColor"
        />
    </svg>
);

export const ListIcon = ({ className }: { className: string }) => (
    <svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path
            d="M4.331 1h8.662M1 1h.007m6.656 4h5.33M4.325 5h.006m3.332 4h5.33M4.325 9h.006m0 4h8.662M1 13h.007"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const StreamIcon = ({ className }: { className: string }) => (
    <svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path
            d="M10.999 1h-10m12 4h-12m12 4h-12m0 4h9"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const SidebarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3.895 4h.01m.01 6h-.01m2.629 3H11a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H6.534v12Zm0 0H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3.404M3.895 7h.01"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const SplitIcon = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="16" height="16" viewBox="0 0 14 14" className={className}>
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.2"
            d="M7 1h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7M7 1v12M7 1H3a2 2 0 0 0-2 2v8c0 1.1.9 2 2 2h4M4.5 9 3.18 7.4a.54.54 0 0 1 0-.78L4.5 5m5 4 1.34-1.6a.54.54 0 0 0 0-.78L9.5 5"
        />
    </svg>
);


export const MapIcon = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" /><path d="M15 5.764v15" /><path d="M9 3.236v15" />
    </svg>
);


/**
 * Icon generated from annotate.svg
 */
export const AnnotateIcon = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            data-component="AnnotateIcon"
        >
            <path
                fill="currentColor"
                d="M15 0q.406 0 .703.297A.96.96 0 0 1 16 1v15l-4-3H1a.97.97 0 0 1-.703-.29A.95.95 0 0 1 0 12V1A.96.96 0 0 1 .29.29.97.97 0 0 1 1 0zM7 3l-.469.063q-.468.062-1.031.437T4.469 4.688Q3.999 5.5 4 7l.002.063.006.062a1 1 0 0 1 .008.11l-.002.074-.006.066a1.45 1.45 0 0 0 .43 1.188Q4.874 9 5.5 9q.624 0 1.063-.438Q7 8.126 7 7.5q0-.624-.438-1.063A1.45 1.45 0 0 0 5.5 6a1.5 1.5 0 0 0-.422.062q.266-1.545 1.094-1.804L7 4zm5 0-.469.063q-.468.062-1.031.437T9.469 4.688Q8.999 5.5 9 7l.002.063.006.062a1 1 0 0 1 .008.11l-.002.074-.006.066a1.45 1.45 0 0 0 .43 1.188Q9.874 9 10.5 9q.624 0 1.063-.438Q12 8.125 12 7.5t-.438-1.063A1.45 1.45 0 0 0 10.5 6a1.5 1.5 0 0 0-.422.062q.266-1.545 1.094-1.804L12 4z"
            />
        </svg>
    );
}

export const HighlightIcon = ({ className }: { className?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            aria-hidden="true"
            viewBox="0 0 16 16"
            data-component="HighlightIcon"
            className={className}
        >
            <g fill="none" fillRule="evenodd">
                <path d="M0 0h16v16H0z" />
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15H1zm-.5-6v2l-1 1v-2zm.5-7v6h-2V2zm0-1h-2zm0 8h-2z"
                />
            </g>
        </svg>
    );
}


export const ShareIcon = ({ className }: { className: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            aria-hidden="true"
            viewBox="0 0 16 16"
            data-component="ShareIcon"
            className={className}
        >
            <path
                fill="currentColor"
                d="M15 9a1 1 0 0 1 .993.883L16 10v5a1 1 0 0 1-.883.993L15 16H1a1 1 0 0 1-.993-.883L0 15v-5a1 1 0 0 1 1.993-.117L2 10v4h12v-4a1 1 0 0 1 .883-.993zM8.613.21l.094.083 4 4a1 1 0 0 1-1.32 1.497l-.094-.083L9 3.415V11a1 1 0 0 1-1.993.117L7 11V3.415L4.707 5.707a1 1 0 0 1-1.32.083l-.094-.083a1 1 0 0 1-.083-1.32l.083-.094 4-4A1 1 0 0 1 8.51.14z"
            />
        </svg>
    );
}


export const TrashIcon = ({ className }: { className: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            aria-hidden="true"
            viewBox="0 0 16 16"
            data-component="TrashIcon"
            className={className}
        >
            <g fill="none" fill-rule="evenodd">
                <path d="M0 0h16v16H0z" />
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2 4h12l-2 11H4zM1 1h14z"
                />
            </g>
        </svg>
    );
}

export const ReplyIcon = ({ className }: { className: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            data-component="ReplyIcon"
            className={className}
        >
            <path
                fill="currentColor"
                d="M6.422 5.422q3 0 4.625 1.25t2.375 2.75c.75 1.5.792 1.917.875 2.75l.125 1.25h-2l-.094-.938q-.093-.937-.656-2.062T9.891 8.359q-1.22-.937-3.47-.937H4.829l2 2-1.406 1.422L1 6.422 5.422 2l1.406 1.422-2 2z"
            />
        </svg>
    );
}


export const EditIcon = ({ className }: { className: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            aria-hidden="true"
            viewBox="0 0 16 16"
            data-component="EditIcon"
            className={className}
        >
            <g fill="none" fill-rule="evenodd">
                <path d="M0 0h16v16H0z" />
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m11 4 1 1-9 9-2 1 1-2zm3-3 1 1-1 1-1-1z"
                />
            </g>
        </svg>
    );
}
