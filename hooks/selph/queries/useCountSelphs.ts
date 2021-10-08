import { useQuery } from "react-query";
import queryString from "query-string";

interface Query {
  "user.id": number;
}

interface UseCountSelphsProps {
  query?: Query;
  enabled?: boolean;
}

function useCountSelphs({ query, enabled = true }: UseCountSelphsProps) {
  const parsedQuery = queryString.stringify(query);

  return useQuery<number>(`/selph/count${parsedQuery && "?" + parsedQuery}`, {
    enabled,
  });
}

export default useCountSelphs;
