import { Selph } from "models/selph";
import { useQuery } from "react-query";
import queryString from "query-string";

interface Query {
  "user.id": number;
}

interface UseSelphsProps {
  query?: Query;
}

function useSelphs({ query }: UseSelphsProps) {
  const parsedQuery = queryString.stringify(query);

  return useQuery<Selph[]>(`/selph${parsedQuery && "?" + parsedQuery}`);
}

export default useSelphs;
