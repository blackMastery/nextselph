import { Selph } from "models/selph";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQueryClient } from "react-query";

/**
 * Injects the selph widget on the selph pages.
 */
function useSandbox() {
  const router = useRouter();
  const { selphId } = router.query;

  const queryClient = useQueryClient();

  const selph: Selph = queryClient.getQueryData([
    "selphs",
    { id: Number(selphId) },
  ]);

  const loadSandbox = () => {
    console.log('something anything')
    let sandbox = document.createElement("script");


    sandbox.type = "text/javascript";
    sandbox.src = `/messenger/js/selph.embed.js`;
    sandbox.setAttribute("data-id", "tslphmbed");
    sandbox.setAttribute("data-selphid", selph?.handle || "");
    if (process.env.NODE_ENV === "development") {
      sandbox.setAttribute("data-local", "true");
    }

    document.body.appendChild(sandbox);
  };

  useEffect(() => {
    if (typeof selph?.handle === "string") {
      loadSandbox();

    } else {
      delete window["slphemb"];
      delete window["slphmsn"];

      if (document.contains(document.querySelector("[data-selphid]"))) {
        document.querySelector("[data-selphid]").remove();
      }

      if (
        document.contains(document.getElementById("selph-messenger-widget"))
      ) {
        document.getElementById("selph-messenger-widget").remove();
      }

      if (
        document.contains(
          document.getElementById("selph-messenger-iframe-container")
        )
      ) {
        document.getElementById("selph-messenger-iframe-container").remove();
      }
    }
  }, [selph]);
}

export default useSandbox;
