import { useEffect, useState } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "nostr-share": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
import iroiro from "./iroiroData/iroiro.json";
import {
  Button,
  Chip,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
  Tooltip,
  Fab,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

type DataItem = {
  title: string;
  description: string;
  category: string;
  kind?: number;
  url: string;
  status?: "active" | "inactive";
  failureCount?: number;
};

const IroiroBotDisplay = ({
  theme,
  searchTerm,
  setSearchTerm,
  setOpenSnackbar,
}: {
  theme: Theme;
  searchTerm: string;
  setSearchTerm: any;
  setOpenSnackbar: React.Dispatch<
    React.SetStateAction<{
      isopen: boolean;
      type: string;
      message: string;
    }>
  >;
}) => {
  const [filteredIroiro, setFilteredIroiro] = useState<DataItem[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<keyof DataItem>("title");
  const [showInactive, setShowInactive] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isLargeScreen = useMediaQuery(theme?.breakpoints.up("sm"));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const searchData = () => {
      const filteredData = Object.values(iroiro).filter((item: DataItem) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());

        if (!showInactive && item.status === "inactive") {
          return false;
        }

        return matchesSearch;
      });
      setFilteredIroiro(filteredData);
    };

    searchData();
  }, [searchTerm, showInactive]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      require("@konemono/nostr-share-component");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const shareURL = () => {
    const currentURL = window.location.origin + window.location.pathname;
    console.log(window.location);
    const newURL = new URL(currentURL);
    if (searchTerm.trim() !== "") {
      newURL.searchParams.set("search", searchTerm);
    }
    navigator.clipboard
      .writeText(newURL.href)
      .then(() => {
        setOpenSnackbar({
          isopen: true,
          type: "success",
          message: `Copied share URL: ${newURL.href}`,
        });
      })
      .catch((err) => {
        setOpenSnackbar({
          isopen: true,
          type: "error",
          message: "Failed to copy share URL",
        });
      });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const sortData = (field: keyof DataItem) => {
    const sortedData = [...filteredIroiro].sort((a, b) => {
      if (
        (a[field] === undefined || (a[field] as string) === "") &&
        (b[field] === undefined || (b[field] as string) === "")
      )
        return 0;

      if (b[field] === undefined || (b[field] as string) === "")
        return sortOrder === "asc" ? -1 : 1;

      if (a[field] === undefined || (a[field] as string) === "")
        return sortOrder === "asc" ? 1 : -1;

      if ((a[field] as string) < (b[field] as string))
        return sortOrder === "asc" ? -1 : 1;
      if ((a[field] as string) > (b[field] as string))
        return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredIroiro(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const renderSortIcon = (field: keyof DataItem) => {
    if (field === sortField) {
      return sortOrder === "asc" ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />;
    }
    return null;
  };

  const renderDescription = (description: string) => {
    const replacedDescription = description.replace(
      /nostr:([^\s]+)/g,
      "https://nostter.app/$1"
    );
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = replacedDescription.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <Link
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </Link>
        );
      } else {
        return part;
      }
    });
  };

  const renderStatusIcon = (item: DataItem) => {
    const status = item.status || "active";
    const failureCount = item.failureCount || 0;

    if (status === "inactive") {
      return (
        <Tooltip title={`非アクティブ (失敗回数: ${failureCount})`}>
          <ErrorIcon color="error" fontSize="small" />
        </Tooltip>
      );
    } else if (failureCount > 0) {
      return (
        <Tooltip title={`警告 (失敗回数: ${failureCount}/5)`}>
          <ErrorIcon color="warning" fontSize="small" />
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title="アクティブ">
          <CheckCircleIcon color="success" fontSize="small" />
        </Tooltip>
      );
    }
  };

  const getRowStyles = (item: DataItem) => {
    const status = item.status || "active";
    if (status === "inactive") {
      return {
        opacity: 0.5,
        backgroundColor: theme.palette.action.disabled,
        "& .MuiTableCell-root": {
          color: theme.palette.text.disabled,
        },
      };
    }
    return {};
  };

  const activeCount = Object.values(iroiro).filter(
    (item) => (item as DataItem).status !== "inactive"
  ).length;
  const inactiveCount = Object.values(iroiro).filter(
    (item) => (item as DataItem).status === "inactive"
  ).length;
  const totalCount = Object.values(iroiro).length;

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mt: 8, mb: 6, display: "flex", gap: 1 }}
      >
        iroiro Data
        {isClient && (
          <nostr-share
            data-type="icon"
            data-text={`NostrのiroiroBotのサイト\n${window.location.href}`}
          ></nostr-share>
        )}
      </Typography>
      <Box>
        <Typography>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            href="https://nostter.app/npub1wgpfshr7xjnur3ytj0vg922nc5jceu3xyp8vjklvanvrvrre995s5lrecv"
            underline="always"
            sx={{ mr: 1, fontWeight: "bolder" }}
          >
            iroiroBot
          </Link>
          が以下のNostr関連の情報リストからランダムに一つ選んで毎時16分にポストします。
        </Typography>

        <Box
          sx={{
            mt: 2,
            mb: 2,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Chip
            icon={<CheckCircleIcon />}
            label={`アクティブ: ${activeCount}`}
            color="success"
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<ErrorIcon />}
            label={`非アクティブ: ${inactiveCount}`}
            color="error"
            variant="outlined"
            size="small"
          />
          <Chip label={`合計: ${totalCount}`} variant="outlined" size="small" />
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowInactive(!showInactive)}
            sx={{ ml: "auto" }}
          >
            {showInactive ? "非アクティブを隠す" : "非アクティブを表示"}
          </Button>
        </Box>

        <Box sx={{ mt: 4, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ wordBreak: "keep-all" }}>検索</Typography>
          <TextField
            type="text"
            value={searchTerm}
            onChange={searchHandler}
            variant="filled"
            label="Search..."
            color="primary"
            fullWidth
          />

          <Button
            variant="contained"
            onClick={shareURL}
            sx={{ px: 2, wordBreak: "break-keep", whiteSpace: "nowrap" }}
          >
            copy
            <br />
            share URL
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table
          sx={{
            wordBreak: "break-all",
            whiteSpace: "pre-line",
            bgcolor: theme.palette.background.paper,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "4%", fontWeight: "bold" }}>
                状態
              </TableCell>
              <TableCell
                style={{ width: "20%", fontWeight: "bold" }}
                onClick={() => sortData("title")}
              >
                Title {renderSortIcon("title")}
              </TableCell>
              <TableCell
                style={{ width: "58%", fontWeight: "bold" }}
                onClick={() => sortData("description")}
              >
                Description {renderSortIcon("description")}
              </TableCell>
              {isLargeScreen && (
                <>
                  <TableCell
                    style={{ width: "10%", fontWeight: "bold" }}
                    onClick={() => sortData("category")}
                  >
                    Category {renderSortIcon("category")}
                  </TableCell>
                  <TableCell
                    style={{ width: "8%", fontWeight: "bold" }}
                    onClick={() => sortData("kind")}
                  >
                    Kind {renderSortIcon("kind")}
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIroiro.map((item: DataItem, index: number) => (
              <TableRow key={index} sx={getRowStyles(item)}>
                <TableCell>{renderStatusIcon(item)}</TableCell>
                <TableCell>
                  <Link
                    href={item.url}
                    className="link"
                    target="_blank"
                    rel="external noreferrer"
                    sx={{
                      color:
                        item.status === "inactive"
                          ? "text.disabled"
                          : "primary.main",
                      textDecoration:
                        item.status === "inactive" ? "line-through" : "none",
                    }}
                  >
                    {item.title}
                  </Link>
                </TableCell>
                <TableCell>{renderDescription(item.description)}</TableCell>
                {isLargeScreen && (
                  <>
                    <TableCell>{item.category}</TableCell>
                    <TableCell align="right">{item.kind ?? ""}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <p id="noResultsMessage" style={{ display: "none" }}>
        No matching data found.
      </p>

      {/* Scroll to top button */}
      <Fab
        color="primary"
        size="medium"
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          opacity: showScrollTop ? 1 : 0,
          visibility: showScrollTop ? "visible" : "hidden",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
          zIndex: 1000,
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </>
  );
};

export default IroiroBotDisplay;
