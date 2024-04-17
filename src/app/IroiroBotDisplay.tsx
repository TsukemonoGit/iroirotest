import { useEffect, useState } from "react";
import iroiro from "./iroiroData/iroiro.json";
import Table from "@mui/joy/Table";
import { useTheme } from "@mui/joy/styles";
import { Box, Button, Input, Link } from "@mui/joy";
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

const IroiroBotDisplay: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredIroiro, setFilteredIroiro] = useState<DataItem[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<keyof DataItem>("title");
  const isLargeScreen = useMediaQuery(useTheme().breakpoints.up("sm"));

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

  return (
    <div>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mt: 2, mb: 6, textAlign: "center" }}
      >
        iroiro Data
      </Typography>
      <Box>
        <Typography
          sx={{
            textAlign: "center",
          }}
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
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>検索</Typography>
          <Input
            type="text"
            value={searchTerm}
            onChange={searchHandler}
            placeholder="Search..."
          />

          <Button onClick={shareURL} sx={{ p: 1 }}>
            copy share URL
          </Button>
        </Box>
      </Box>
      <Table
        aria-label="basic table"
        sx={{
          mt: 2,
          wordBreak: "break-all",
          whiteSpace: "pre-line",
        }}
        variant={"soft"}
      >
        <thead>
          <tr>
            <th style={{ width: "20%" }} onClick={() => sortData("title")}>
              Title {renderSortIcon("title")}
            </th>
            <th
              style={{ width: "65%" }}
              onClick={() => sortData("description")}
            >
              Description {renderSortIcon("description")}
            </th>
            {isLargeScreen && (
              <>
                <th
                  style={{ width: "10%" }}
                  onClick={() => sortData("category")}
                >
                  Category {renderSortIcon("category")}
                </th>
                <th style={{ width: "5%" }} onClick={() => sortData("kind")}>
                  Kind {renderSortIcon("kind")}
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredIroiro.map((item: DataItem, index: number) => (
            <tr key={index}>
              <td>
                <Link
                  variant="plain"
                  href={item.url}
                  className="link"
                  target="_blank"
                  rel="external noreferrer"
                >
                  {item.title}
                </Link>
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
