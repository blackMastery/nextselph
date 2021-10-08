import { Imprint } from "models/imprint";
import { useQuery } from "react-query";

type UseImprintProps = {
  imprintId: number;
  enabled?: boolean;
};

function useImprint({ imprintId, enabled }: UseImprintProps) {
  return useQuery<Imprint>(`/imprint/${imprintId}`, { enabled });
}

export default useImprint;
