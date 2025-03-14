import { useEffect, useState } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'nostr-share': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
import iroiro from "./iroiroData/iroiro.json";
import {
  Button,

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

} from "@mui/material";
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

type DataItem = {
  title: string;
  description: string;
  category: string;
  kind?: number;
  url: string;
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
  const isLargeScreen = useMediaQuery(theme?.breakpoints.up("sm"));
  const [isClient, setIsClient] = useState(false);
  //console.log(theme);
  useEffect(() => {
    const searchData = () => {
      const filteredData = Object.values(iroiro).filter(
        (item: DataItem) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIroiro(filteredData);
    };

    searchData();
  }, [searchTerm]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      require("@konemono/nostr-share-component");
    }
  }, []);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const shareURL = () => {
    const currentURL = window.location.origin + window.location.pathname;
    console.log(window.location);
    const newURL = new URL(currentURL);
    if (searchTerm.trim() !== "") {
      newURL.searchParams.set("search", searchTerm); // クエリパラメータ 'search' に検索テキストをセット
    }
    navigator.clipboard
      .writeText(newURL.href)
      .then(() => {
        // alert("Copied share URL: " + newURL.href);
        setOpenSnackbar({
          isopen: true,
          type: "success",
          message: `Copied share URL: ${newURL.href}`,
        });
      })
      .catch((err) => {
        //console.error("Failed to copy share URL: ", err);
        setOpenSnackbar({
          isopen: true,
          type: "error",
          message: "Failed to copy share URL",
        });
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

      // 通常の比較
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

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mt: 8, mb: 6, display: "flex", gap: 1 }}>
        iroiro Data{isClient && (
          <nostr-share
            data-type="icon"
            data-text={`NostrのiroiroBotのサイト\n${window.location.href}`}
          ></nostr-share>
        )}
      </Typography>
      <Box>
        <Typography
        // sx={{
        //   textAlign: "center",
        // }}
        >
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
              <TableCell
                style={{ width: "22%", fontWeight: "bold" }}
                onClick={() => sortData("title")}
              >
                Title {renderSortIcon("title")}
              </TableCell>
              <TableCell
                style={{ width: "60%", fontWeight: "bold" }}
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
              <TableRow key={index}>
                <TableCell>
                  <Link
                    href={item.url}
                    className="link"
                    target="_blank"
                    rel="external noreferrer"
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
    </>
  );
};

export default IroiroBotDisplay;
