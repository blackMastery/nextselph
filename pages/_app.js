import "../styles/globals.css";
import "../node_modules/video-react/dist/video-react.css";
import { Provider as BumbagProvider, ToastManager } from "bumbag";
import theme from "../theme";
import { httpClient } from "../utils/httpClient";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
const defaultQueryFn = async ({ queryKey }) => {
  const { data } = await httpClient.get(queryKey[0]);
  return data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BumbagProvider theme={theme} isSSR>
          <div className={"tour-root"}>
            <Component {...pageProps} />
          </div>
          <ToastManager />
        </BumbagProvider>
        <ReactQueryDevtools initialIsOpen={false} position="top-right" />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
