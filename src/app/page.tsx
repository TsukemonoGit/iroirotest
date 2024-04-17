"use client";
import IroiroBotDisplay from "./IroiroBotDisplay";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme();
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between container mx-auto p-1 ">
      <IroiroBotDisplay />
    </main>
  );
}
