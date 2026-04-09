// NOTE: RlusdIcon — Ripple-specific branding used internally. Review before v1.1.0: move to consuming app?
import * as React from "react"
import { cn } from "./utils"

/* ─── RLUSD token icon (exact Figma rlusd-issue paths) ─── */
export function RlusdIcon({ className }: { className?: string }) {
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M44 24C44 31.732 37.732 38 30 38C22.268 38 16 31.732 16 24C16 16.268 22.268 10 30 10C37.732 10 44 16.268 44 24ZM36.2948 28.6949C36.2948 30.4528 34.8367 31.9689 32.9626 31.9689C31.0631 31.9689 29.6375 30.4191 29.6375 28.6949C29.6375 28.1477 29.7769 27.5679 30.0767 26.9708C30.2347 26.6559 30.309 26.3631 30.309 26.1006C30.309 25.3175 29.6108 24.8586 29.0415 24.8586C28.5826 24.8586 28.1515 25.1386 27.8076 25.6602C27.0896 26.7489 26.0881 27.3263 24.9193 27.3263C23.0813 27.3263 21.5919 25.8368 21.5919 23.9988C21.5919 22.1608 23.0813 20.6713 24.9193 20.6713C26.0881 20.6713 27.0896 21.2488 27.8076 22.3374C28.1515 22.8591 28.5826 23.1391 29.0415 23.1391C29.6108 23.1391 30.309 22.6801 30.309 21.8971C30.309 21.6357 30.2347 21.3429 30.0767 21.0269C29.7769 20.4285 29.6375 19.8499 29.6375 19.3027C29.6375 17.5646 31.0875 16.0287 32.9626 16.0287C34.8378 16.0287 36.2948 17.5449 36.2948 19.3027C36.2948 21.1825 34.9285 22.5709 32.9626 22.6871C32.039 22.7429 31.4895 23.2308 31.4895 23.9988C31.4895 24.7668 32.039 25.2559 32.9626 25.3105C34.9285 25.4267 36.2948 26.8139 36.2948 28.6949Z" fill="#0045C6"/>
            <path d="M15.9971 10.1421C9.21392 11.1138 4 16.948 4 23.9999C4 31.0518 9.21392 36.886 15.9971 37.8577C11.2163 35.0908 8 29.921 8 23.9999C8 18.0788 11.2163 12.909 15.9971 10.1421Z" fill="#6DC3FF"/>
            <path d="M21 37.6777C14.7096 36.3044 10 30.7021 10 23.9999C10 17.2977 14.7096 11.6954 21 10.3221C21.2765 10.2617 21.5561 10.2095 21.8384 10.1658C21.8912 10.1576 21.9441 10.1497 21.9971 10.1421C17.2163 12.909 14 18.0788 14 23.9999C14 29.921 17.2163 35.0908 21.9971 37.8577C21.6791 37.8122 21.3646 37.7559 21.0539 37.6894C21.0359 37.6855 21.018 37.6816 21 37.6777Z" fill="#6DC3FF"/>
        </svg>
    )
}

/* ─── Radio indicator ─── */
function RadioIndicator({ checked }: { checked: boolean }) {
    return (
        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
            <div className={cn(
                "w-4 h-4 rounded-full transition-all",
                checked
                    ? "border-[5px] border-[#005BCC]"
                    : "border-[1.5px] border-[#767F86]"
            )} />
        </div>
    )
}

/* ─── Checkbox indicator ─── */
function CheckboxIndicator({ checked }: { checked: boolean }) {
    return (
        <div className={cn(
            "w-5 h-5 rounded-[3px] flex items-center justify-center shrink-0 transition-all border",
            checked
                ? "bg-[#005BCC] border-[#005BCC]"
                : "bg-white border-[#767F86]"
        )}>
            {checked && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1.5 4L3.5 6.5L8.5 1" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
    )
}

/* ─── FormCard ─── */
export interface FormCardProps {
    label: string
    description?: string
    icon?: React.ReactNode
    selected?: boolean
    disabled?: boolean
    selectionType?: "radio" | "checkbox"
    /** "tall" = stacked (default), "long" = horizontal */
    layout?: "tall" | "long"
    onClick?: () => void
    className?: string
}

export function FormCard({
    label,
    description,
    icon,
    selected = false,
    disabled = false,
    selectionType = "radio",
    layout = "tall",
    onClick,
    className,
}: FormCardProps) {
    const stateClass = disabled
        ? "opacity-40 cursor-not-allowed bg-[#F4FBFF] border-[#005BCC]"
        : selected
            ? "bg-[#F4FBFF] border-[#005BCC] cursor-pointer hover:bg-[#E5F7FF] active:bg-white active:border-[#001133]"
            : "bg-white border-[#D6D9DB] cursor-pointer hover:bg-[#F4FBFF] hover:border-[#005BCC] active:bg-white active:border-[#001133]"

    const Indicator = selectionType === "checkbox" ? CheckboxIndicator : RadioIndicator

    const baseClass = cn(
        "border rounded-lg p-4 transition-all duration-150 outline-none",
        "focus-visible:ring-4 focus-visible:ring-[#65BEFF] focus-visible:ring-offset-0",
        stateClass,
        className
    )

    if (layout === "long") {
        return (
            <div
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-pressed={selected}
                aria-disabled={disabled}
                onClick={disabled ? undefined : onClick}
                onKeyDown={e => { if (!disabled && (e.key === "Enter" || e.key === " ")) onClick?.() }}
                className={cn(baseClass, "flex items-center gap-3")}
            >
                <Indicator checked={selected} />
                <div className="flex-1 flex items-center justify-between gap-4 min-w-0">
                    <div className="flex flex-col gap-1 min-w-0">
                        <p className="text-[14px] font-bold text-[#14191E] leading-5">{label}</p>
                        {description && <p className="text-[14px] font-normal text-[#14191E] leading-5">{description}</p>}
                    </div>
                    {icon && <div className="shrink-0">{icon}</div>}
                </div>
            </div>
        )
    }

    // tall (default) — stacked layout
    return (
        <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-pressed={selected}
            aria-disabled={disabled}
            onClick={disabled ? undefined : onClick}
            onKeyDown={e => { if (!disabled && (e.key === "Enter" || e.key === " ")) onClick?.() }}
            className={cn(baseClass, "flex flex-col gap-2")}
        >
            {/* top row: indicator + icon */}
            <div className="flex items-center gap-2">
                <Indicator checked={selected} />
                {icon && <div className="shrink-0">{icon}</div>}
            </div>
            {/* content: label + description */}
            <div className="flex flex-col gap-1">
                <p className="text-[14px] font-bold text-[#14191E] leading-5">{label}</p>
                {description && <p className="text-[14px] font-normal text-[#14191E] leading-5">{description}</p>}
            </div>
        </div>
    )
}
