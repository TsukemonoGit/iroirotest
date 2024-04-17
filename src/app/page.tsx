"use client";
import { Tabs, TabList, tabClasses, Tab, Typography } from "@mui/joy";
import IroiroBotDisplay from "./IroiroBotDisplay";
import Feedback from "./Feedback";
import { Alert, Snackbar } from "@mui/material";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter from Next.js
export default function Home() {
  const [selectedTab, setSelectedTab] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window?.location?.search);
      const pageid = searchParams.get("page");
      console.log(pageid);
      if (pageid) {
        setSelectedTab("pageid");
      }
    }
  }, []);
  const [openSnackbar, setOpenSnackbar] = useState({
    isopen: false,
    type: "success",
    message: "",
  });

  const handleChangeTab = (event: any, newValue: any) => {
    setSelectedTab(newValue);
  };
  const handleSnackClose = () => {
    setOpenSnackbar({ isopen: false, type: "success", message: "" });
  };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="flex min-h-screen flex-col items-center  container mx-auto p-1 ">
        <Typography gutterBottom>Nostr iroiroBot</Typography>
        <Tabs
          aria-label="tabs"
          sx={{ bgcolor: "transparent" }}
          defaultValue={selectedTab}
          onChange={handleChangeTab}
        >
          <TabList
            disableUnderline
            sx={{
              p: 0.5,
              gap: 0.5,
              borderRadius: "xl",
              bgcolor: "background.level1",
              [`& .${tabClasses.root}[aria-selected="true"]`]: {
                boxShadow: "sm",
                bgcolor: "background.surface",
              },
            }}
          >
            <Tab disableIndicator value="home">
              Home
            </Tab>
            <Tab disableIndicator value="feedback">
              Feedback
            </Tab>
          </TabList>
        </Tabs>
        {selectedTab === "home" ? (
          <IroiroBotDisplay />
        ) : (
          <Feedback setOpenSnackbar={setOpenSnackbar} />
        )}
        <Snackbar
          open={openSnackbar.isopen}
          autoHideDuration={5000}
          onClose={handleSnackClose}
        >
          <Alert
            onClose={handleSnackClose}
            severity={
              (openSnackbar.type as "success") || "info" || "warning" || "error"
            }
            variant="filled"
            sx={{ width: "100%" }}
          >
            {openSnackbar.message}
          </Alert>
        </Snackbar>
      </main>
    </Suspense>
  );
}
