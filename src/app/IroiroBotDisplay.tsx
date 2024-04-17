import { useEffect, useState } from "react";
import iroiro from "@/app/iroiroData/iroiro.json";
import Table from "@mui/joy/Table";
import { theme } from "./page";
import { Box, Button, Input, Stack } from "@mui/joy";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

type DataItem = {
  title: string;
  description: string;
  category: string;
  kind?: number;
  url: string;
};

const IroiroBotDisplay: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredIroiro, setFilteredIroiro] = useState<DataItem[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<keyof DataItem>("title");
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    const searchData = () => {
      const filteredData = Object.values(iroiro).filter((item: DataItem) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIroiro(filteredData);
    };

    searchData();
  }, [searchTerm]);

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const shareURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        alert("Copied share URL: " + currentURL);
      })
      .catch((err) => {
        console.error("Failed to copy share URL: ", err);
      });
  };

  const sortData = (field: keyof DataItem) => {
    const sortedData = [...filteredIroiro].sort((a, b) => {
      console.log(a[field], b[field]);
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

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Nostr iroiroBot JSON Data Display
      </Typography>
      <Box>
        <Typography>
          iroiroBotが以下のNostr関連の情報リストからランダムに一つ選んで毎時16分にポストします。
          <br />
          内容について何かあれば <a href="./feedback.html">こちらから</a>{" "}
          からご連絡ください。
        </Typography>
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>検索</Typography>
          <Input
            type="text"
            value={searchTerm}
            onChange={searchHandler}
            placeholder="Search..."
          />

          <Button onClick={shareURL} sx={{ p: 0 }}>
            copy share URL
          </Button>
        </Box>
      </Box>
      <Table
        aria-label="basic table"
        sx={{
          mt: 1,
          wordBreak: "break-all",
          whiteSpace: "pre-line",
          bgcolor: theme.palette.background.default,
        }}
      >
        <thead>
          <tr className={""}>
            <th style={{ width: "20%" }} onClick={() => sortData("title")}>
              Title
            </th>
            <th
              style={{ width: "65%" }}
              onClick={() => sortData("description")}
            >
              Description
            </th>
            {isLargeScreen && (
              <>
                <th
                  style={{ width: "10%" }}
                  onClick={() => sortData("category")}
                >
                  Category
                </th>
                <th style={{ width: "5%" }} onClick={() => sortData("kind")}>
                  Kind
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredIroiro.map((item: DataItem, index: number) => (
            <tr key={index}>
              <td>
                <a
                  href={item.url}
                  className="link"
                  target="_blank"
                  rel="external noreferrer"
                >
                  {item.title}
                </a>
              </td>
              <td>{item.description}</td>
              {isLargeScreen && (
                <>
                  <td>{item.category}</td>
                  <td>{item.kind ?? ""}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      <p id="noResultsMessage" style={{ display: "none" }}>
        No matching data found.
      </p>
    </div>
  );
};

export default IroiroBotDisplay;
