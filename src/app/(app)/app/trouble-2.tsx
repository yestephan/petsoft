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
    const response = await fetch(
      "https://bytegrad.com/course-assets/projects/petsoft/api/pets",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch pets");
    }

    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");
    console.log("Content-Type:", contentType);
    console.log("Content-Length:", contentLength);

    const text = await response.text();
    console.log("Raw response:", text);

    // Use regex to extract the JSON part
    const match = text.match(/(\[.*\])/);
    if (!match) {
      throw new Error("Valid JSON not found in the response");
    }

    const validJsonText = match[1];
    console.log("Extracted JSON:", validJsonText);

    // Try parsing the JSON, catch and log any errors
    let data: Pet[];
    try {
      data = JSON.parse(validJsonText);
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      console.error(
        "Extracted JSON text that caused the error:",
        validJsonText
      );
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
