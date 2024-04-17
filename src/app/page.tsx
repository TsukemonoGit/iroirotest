"use client";
import { Tabs, TabList, tabClasses, Tab, Typography } from "@mui/joy";
import IroiroBotDisplay from "./IroiroBotDisplay";
import Feedback from "./Feedback";
import {
  Alert,
  Snackbar,
  Theme,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { Suspense, useEffect, useMemo, useState } from "react";
import React from "react";

export default function Home() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme: Theme = React.useMemo(() => {
    console.log(prefersDarkMode);
    return createTheme({
      palette: {
        mode: prefersDarkMode ? "dark" : "light",
      },
    });
  }, [prefersDarkMode]);

  const [selectedTab, setSelectedTab] = useState("home");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window?.location?.search);
      const pageid = searchParams.get("page");
      console.log(pageid);
      setSelectedTab(pageid || "home");
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
    <main className="flex min-h-screen flex-col items-center  container mx-auto p-1 ">
      <Typography gutterBottom>Nostr iroiroBot</Typography>
      <Tabs
        aria-label="tabs"
        sx={{ bgcolor: "transparent" }}
        value={selectedTab}
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
        <IroiroBotDisplay theme={theme} />
      ) : (
        <Feedback setOpenSnackbar={setOpenSnackbar} theme={theme} />
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
