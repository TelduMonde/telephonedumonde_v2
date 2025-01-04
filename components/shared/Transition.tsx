/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "framer-motion";

export const Transition = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const anim = (variants: any) => {
    return {
      initial: "initial",
      animate: "enter",
      exit: "exit",
      variants,
    };
  };

  const opacity = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: {
        duration: 2,
      },
    },
    exit: {
      opacity: 1,
    },
  };

  return <motion.div {...anim(opacity)}>{children}</motion.div>;
};
