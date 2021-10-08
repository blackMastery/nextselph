import { Selph } from "models/selph";
import { useQuery } from "react-query";
import { httpClient } from "utils/httpClient";

interface UseSelphProps {
  selphId: number;
  enabled?: boolean;
}

function useSelph({ selphId, enabled }: UseSelphProps) {
  return useQuery<Selph>(
    
    ["selphs", { id: selphId }],
    async () => {
      const { data } = await httpClient.get(`/selph/${selphId}`);
      return data;
    },
    { enabled }
  );
}

export default useSelph;
