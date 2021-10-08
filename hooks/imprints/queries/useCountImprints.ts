import { useQuery } from "react-query";
import queryString from "query-string";

interface Query {
  "selph.user.id": number;
}

interface UseCountImprintsProps {
  query?: Query;
  enabled?: boolean;
}

function useCountImprints({ query, enabled = true }: UseCountImprintsProps) {
  const parsedQuery = queryString.stringify(query);

  return useQuery<number>(`/imprint/count${parsedQuery && "?" + parsedQuery}`, {
    enabled,
  });
}

export default useCountImprints;
