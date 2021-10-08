import { atom } from 'jotai'
import { useAtomDevtools } from 'jotai/devtools'
import { Imprint } from 'models/imprint'


export const isCreateImprintLoadingAtom = atom<boolean>(false)
isCreateImprintLoadingAtom.debugLabel = 'Is Create Imprint Loading'

export const useIsCreateImprintLoadingAtomDevtools = () => useAtomDevtools(isCreateImprintLoadingAtom)



export const isCreateImprintSuccessAtom = atom<boolean>(false)
isCreateImprintSuccessAtom.debugLabel = 'Is Create Imprint Success'

export const useIsCreateImprintSuccessAtomDevtools = () => useAtomDevtools(isCreateImprintSuccessAtom)

export const newImprintAtom = atom<Imprint>(null as Imprint)
newImprintAtom.debugLabel = 'New Imprint'

export const newImprintAtomDevtools = () => useAtomDevtools(newImprintAtom)