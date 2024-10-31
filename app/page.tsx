import { redirect } from "next/navigation";

const Home = () => {
  redirect("/dashboard/jobs");
};

export default Home;
