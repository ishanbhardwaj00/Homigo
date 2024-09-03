import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["300", "400", "700"],
  style: "normal",
  subsets: ["latin"],
});

const page = () => {
  return (
    <div className="flex flex-col items-center bg-register bg-contain bg-no-repeat h-screen max-h-screen bg-bottom">
      <div className="w-4/5 flex flex-col">
        <div
          className={`${poppins.className} flex flex-col text-3xl font-bold text-primary p-5`}
        >
          <span>Let's Keep It</span>
          <span>Real,</span>
          <span>Verify With,</span>
          <span>Aadhar</span>
        </div>
      </div>
    </div>
  );
};

export default page;
