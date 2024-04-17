"use client";
import { Tabs, TabList, tabClasses, Tab, Typography } from "@mui/joy";
import IroiroBotDisplay from "./IroiroBotDisplay";
import Feedback from "./Feedback";
import { Alert, Snackbar } from "@mui/material";
import { useState, useEffect, Suspense } from "react";

export default function Home() {
  const searchParams = new URLSearchParams(window.location.search);

  // Check if searchParams is null before using it
  const page = searchParams ? searchParams.get("page") : null;
  console.log(page);

  // const initialTab = query.feedback ? "feedback" : "home";
  const [openSnackbar, setOpenSnackbar] = useState({
    isopen: false,
    type: "success",
    message: "",
  });
  const [selectedTab, setSelectedTab] = useState(page ? page : "home");

  const handleChangeTab = (event: any, newValue: any) => {
    setSelectedTab(newValue);
  };
  const handleSnackClose = () => {
    setOpenSnackbar({ isopen: false, type: "success", message: "" });
  };
  return (
    <main className="flex min-h-screen flex-col items-center  container mx-auto p-1 ">
      <Typography gutterBottom>Nostr iroiroBot</Typography>
      <Tabs
        aria-label="tabs"
        sx={{ bgcolor: "transparent" }}
        defaultValue={page ? page : "home"}
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
  );
}
