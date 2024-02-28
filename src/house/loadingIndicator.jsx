const LoadingIndicator = ({ loadingState }) => {

  console.log("Loading Indicator Component state = " + loadingState);
  return <h3>{loadingState}</h3>;
};

export default LoadingIndicator;
