import axios from "axios";
import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import PetContextProvider from "@/contexts/pet-context-provider";
import { Pet } from "@/lib/types";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const response = await axios.get(
      "https://bytegrad.com/course-assets/projects/petsoft/api/pets"
    );

    const text = JSON.stringify(response.data);
    // console.log("Raw response:", text);

    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Valid JSON not found in the response");
    }

    const validJsonText = text.slice(jsonStart, jsonEnd).trim();
    // console.log("Extracted JSON:", validJsonText);

    let data: Pet[];
    try {
      data = JSON.parse(validJsonText);
    } catch (jsonError) {
      // console.error("JSON parsing error:", jsonError);
      // console.error(
      //   "Extracted JSON text that caused the error:",
      //   validJsonText
      // );
      throw new Error("Failed to parse JSON");
    }

    return (
      <>
        <BackgroundPattern />
        <div className="flex flex-col max-w-[1050px] mx-auto px-4 min-h-screen">
          <AppHeader />
          <PetContextProvider data={data}>{children}</PetContextProvider>
          <AppFooter />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error in Layout component:", error);
    return <div>Error loading data</div>;
  }
}
