import {
  imprintFilterAtom,
  useImprintFilterAtomDevtools,
} from "atoms/imprintFilterAtom";
import { Input } from "bumbag";
import { useAtom } from "jotai";
import { focusAtom } from "jotai/optics";
import React, { useState } from "react";
import { useQueryClient } from "react-query";

const queryAtom = focusAtom(imprintFilterAtom, (optic) => optic.prop("query"));

function ImprintSearchBox() {
  useImprintFilterAtomDevtools();
  const SEARCH_TIMEOUT = 400;
  const [query, setQuery] = useAtom(queryAtom);
  const [queryTimeout, setQueryTimeout] = useState<NodeJS.Timeout>();
  const queryClient = useQueryClient();

  const onStopTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setQuery(e.target.value);

    queryClient.invalidateQueries(["imprints", { selphId: 1 }]);
    queryClient.resetQueries(["imprints", { selphId: 1 }]);
    queryClient.fetchQuery(["imprints", { selphId: 1 }]);
  };

  const onStartTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(queryTimeout);
    if (e.target.value === "") setQuery("");
    if (e.target.value) {
      setQueryTimeout(setTimeout(() => onStopTyping(e), SEARCH_TIMEOUT));
    }
  };

  return (
    <div>
      <Input
        marginY="minor-4"
        label="Search imprints"
        onKeyUp={onStartTyping as any}
      ></Input>
    </div>
  );
}

export default ImprintSearchBox;
