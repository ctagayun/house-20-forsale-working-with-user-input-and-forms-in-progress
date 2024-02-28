import { useCallback, useState } from "react";
import loadingStatus from "../src/helpers/loadingStatus";

const useGetRequest = (url) => {
  console.log("Executing useGetRequest hook URL = " + url);

  const [loadingState, setLoadingState] = useState(loadingStatus.isLoading);

  //This is called from the return statement below
  const get = useCallback(async () => {
    console.log("Executing useCallback");
    setLoadingState(loadingStatus.isLoading);
    try {
      const rsp = await fetch(url);
      const result = await rsp.json();
      setLoadingState(loadingStatus.loaded);
      console.log("Successful Fetch result = " + result);
      return result;
    } catch {
      console.log("Error Fetch result = " + loadingStatus.hasErrored);
      setLoadingState(loadingStatus.hasErrored);
    }
  }, [url]);

  //Call "get - useCallBack
  return { get, loadingState };
};

export default useGetRequest;
