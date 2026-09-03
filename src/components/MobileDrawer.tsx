import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

interface MobileDrawerProps {
  isOpen: boolean;
  children: ReactNode;
}

const MobileDrawer = ({ isOpen, children }: MobileDrawerProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="fixed inset-x-0 top-16 z-40 overflow-hidden border-b border-neutral-800 bg-neutral-900 md:hidden"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export default MobileDrawer;
