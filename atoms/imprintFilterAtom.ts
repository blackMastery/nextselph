import { atom } from 'jotai'
import { useAtomDevtools } from 'jotai/devtools'

interface ImprintFilterAtom {
    query: string;
}

export const imprintFilterAtom = atom<ImprintFilterAtom>({ query: "" })
imprintFilterAtom.debugLabel = 'Imprint Filter'

export const useImprintFilterAtomDevtools = () => useAtomDevtools(imprintFilterAtom)