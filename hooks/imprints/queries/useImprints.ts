import { useQuery } from "react-query";
import { Imprint } from "models/imprint";
import { httpClient } from "utils/httpClient";
import { useAtom } from "jotai";
import { imprintFilterAtom } from "atoms/imprintFilterAtom";
import { useCallback, useEffect } from "react";

interface UseImprintsProps {
  selphId: number;
  enabled?: boolean;
  onSuccess?: (imprints: Imprint[]) => any;
}

function useImprints({ selphId, onSuccess, enabled = true }: UseImprintsProps) {
  const [imprintFilter] = useAtom(imprintFilterAtom);

  const queryFn = useCallback(async () => {
    const { data } = await httpClient.get(
      `/selph/${selphId}/imprints${
        imprintFilter.query ? `?search=${imprintFilter.query}` : ""
      }`
    );
    return data;
  }, [imprintFilter, selphId]);

  const query = useQuery<Imprint[]>(
    ["imprints", { selphId }, imprintFilter.query],
    queryFn,
    {
      enabled,
      onSuccess,
    }
  );

  return query;
}

export default useImprints;
