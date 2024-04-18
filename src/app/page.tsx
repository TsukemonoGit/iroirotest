"use client";

import IroiroBotDisplay from "./IroiroBotDisplay";
import Feedback from "./Feedback";
import {
  Alert,
  Box,
  Snackbar,
  Tab,
  Tabs,
  Theme,
  ThemeProvider,
  Typography,
  alpha,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { Suspense, useEffect, useMemo, useState } from "react";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import FeedbackIcon from "@mui/icons-material/Feedback";
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("home");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window?.location?.search);
      const pageid = searchParams.get("page");
      const searchWord = searchParams.get("search") ?? "";
      console.log(searchWord);
      setSearchTerm(searchWord);
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
    <ThemeProvider theme={theme}>
      <main className="flex min-h-screen flex-col items-center  container mx-auto p-1 ">
        <Box
          sx={{
            //    borderColor: theme.palette.divider,
            width: "100%",
            maxWidth: "1536px",
            boxShadow: "1",
            top: 0,
            justifyContent: "space-between",
            display: "flex",
          }}
          bgcolor={
            theme.palette.mode === "light"
              ? `${alpha(theme.palette.grey[300], 0.7)}`
              : `${alpha(theme.palette.grey[800], 0.7)}`
          }
          position="fixed"
        >
          <Typography
            variant="h6"
            sx={{
              alignSelf: "center",
              px: 1,
              color: theme.palette.text.secondary,
            }}
          >
            Nostr iroiroBot
          </Typography>
          <Tabs
            aria-label="tabs"
            value={selectedTab}
            onChange={handleChangeTab}
            /*   variant="fullWidth" */
            textColor="secondary"
            indicatorColor="secondary"
          >
            {/* <TabList
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
        > */}
            <Tab
              value="home"
              label="Home"
              icon={<HomeIcon />}
              sx={{ py: 0, minHeight: "0", px: [0, 2, 4] }}
            />

            <Tab
              value="feedback"
              label="Feedback"
              icon={<FeedbackIcon />}
              sx={{ py: 0, px: [0, 2, 4], minHeight: "0" }}
            />
          </Tabs>
        </Box>

        {/* <TabPanel value="home">
        {" "}
        <IroiroBotDisplay theme={theme} />
      </TabPanel>
      <TabPanel value="feedback">
        <Feedback setOpenSnackbar={setOpenSnackbar} theme={theme} />
      </TabPanel> */}
        {selectedTab === "home" ? (
          <IroiroBotDisplay
            theme={theme}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setOpenSnackbar={setOpenSnackbar}
          />
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
    </ThemeProvider>
  );
}
