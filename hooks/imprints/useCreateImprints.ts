import useCreateImprint, { ImprintData } from "./mutations/useCreateImprint";

function useCreateImprints() {
  const { mutateAsync, isLoading } = useCreateImprint({})
  const createImprints = (imprints: ImprintData[]) => {
    const mutations = []
    imprints.forEach(imprint => mutations.push(mutateAsync(imprint)))
    return Promise.all(mutations)
  }
  return { createImprints, isLoading };
}

export default useCreateImprints;
