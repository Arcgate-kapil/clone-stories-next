import HomePage from "./HomePage";

export default function HomePageServer(props) {
  return (
    <>
      {/* Only interactive part client */}
      <HomePage {...props} />
    </>
  );
}