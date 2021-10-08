import { atom } from "jotai";
import { useAtomDevtools } from "jotai/devtools";

export const joyrideStepAtom = atom(0)
joyrideStepAtom.debugLabel = 'Joyride Step'

export const useJoyrideStepAtomDevtools = () => useAtomDevtools(joyrideStepAtom)