import * as React from "react"

// Chevron icon
const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`ml-2 h-5 w-5 text-yellow-400 transition-transform duration-300 ease-in-out ${open ? "rotate-180" : "rotate-0"}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
  </svg>
)

type AccordionContextType = {
  openItem: string | null
  setOpenItem: (value: string | null) => void
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined)

export const Accordion: React.FC<{
  type?: "single"
  collapsible?: boolean
  className?: string
  children: React.ReactNode
}> = ({ type = "single", collapsible = true, className, children }) => {
  const [openItem, setOpenItem] = React.useState<string | null>(null)
  return (
    <AccordionContext.Provider value={{ openItem, setOpenItem }}>
      <div className={className || "w-full space-y-4"}>{children}</div>
    </AccordionContext.Provider>
  )
}

export const AccordionItem: React.FC<{
  value: string
  className?: string
  children: React.ReactNode
}> = ({ value, className, children }) => {
  return (
    <div
      className={
        className ||
        "bg-gradient-to-br from-gray-950 to-gray-900 rounded-xl border border-gray-800 shadow-lg overflow-hidden transition-all duration-300"
      }
      data-accordion-item={value}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child, { itemValue: value })
      })}
    </div>
  )
}

export const AccordionTrigger: React.FC<{
  children: React.ReactNode
  className?: string
  itemValue?: string
}> = ({ children, className, itemValue }) => {
  const ctx = React.useContext(AccordionContext)
  if (!ctx || !itemValue) return null
  const isOpen = ctx.openItem === itemValue
  return (
    <button
      type="button"
      className={
        className ||
        `w-full text-left py-5 px-7 font-semibold flex items-center justify-between focus:outline-none transition-all duration-200
        ${isOpen ? "bg-yellow-500/20 text-yellow-400 shadow-md" : "text-gray-200 hover:bg-yellow-500/10 hover:text-yellow-300"}
        rounded-xl`
      }
      onClick={() => ctx.setOpenItem(isOpen ? null : itemValue)}
      data-state={isOpen ? "open" : "closed"}
      style={{ boxShadow: isOpen ? "0 2px 12px 0 rgba(218,189,40,0.12)" : undefined }}
    >
      <span>{children}</span>
      <ChevronIcon open={isOpen} />
    </button>
  )
}

export const AccordionContent: React.FC<{
  children: React.ReactNode
  className?: string
  itemValue?: string
}> = ({ children, className, itemValue }) => {
  const ctx = React.useContext(AccordionContext)
  if (!ctx || !itemValue) return null
  const isOpen = ctx.openItem === itemValue

  return (
    <div
      className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[500px] opacity-100 scale-100 py-5 px-7" : "max-h-0 opacity-0 scale-95 p-0"} ${
        className || "text-gray-300 text-base bg-gradient-to-br from-gray-950 to-gray-900 border-t border-gray-800 rounded-b-xl"
      }`}
      data-state={isOpen ? "open" : "closed"}
      style={{
        boxShadow: isOpen ? "0 2px 12px 0 rgba(218,189,40,0.10)" : undefined,
        transitionProperty: "max-height, opacity, transform, box-shadow, padding"
      }}
    >
      {children}
    </div>
  )
}
