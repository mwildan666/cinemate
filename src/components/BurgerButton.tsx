import { motion } from "motion/react";

interface BurgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const BAR_CLASSES = "h-0.5 rounded-full bg-current";
const BAR_TRANSITION = { duration: 0.25, ease: "easeInOut" as const };

const BurgerButton = ({ isOpen, onClick }: BurgerButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={isOpen ? "Close menu" : "Open menu"}
    aria-expanded={isOpen}
    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
  >
    <span className="flex h-4 w-5 flex-col justify-between">
      <motion.span
        className={BAR_CLASSES}
        animate={{ y: isOpen ? 7 : 0, rotate: isOpen ? 45 : 0 }}
        transition={BAR_TRANSITION}
      />
      <motion.span
        className={BAR_CLASSES}
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.span
        className={BAR_CLASSES}
        animate={{ y: isOpen ? -7 : 0, rotate: isOpen ? -45 : 0 }}
        transition={BAR_TRANSITION}
      />
    </span>
  </button>
);

export default BurgerButton;
