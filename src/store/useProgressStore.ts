import { useLayoutEffect } from "react";
import { object } from "zod";
import create from "zustand";

export const useProgressStore = create((set) => ({
  isAnimating: false, 
  setIsAnimating : (isAnimating: any | object) => set(() => ({isAnimating: isAnimating}))
}));