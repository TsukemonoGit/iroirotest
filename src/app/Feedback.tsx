import { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { sendMessage } from "./function";
import { sendpub } from "./function";

export default function Feedback({ setOpenSnackbar }: any) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const MAX_MESSAGE_LENGTH = 400;

  const handleSendMessage = async () => {
    // if (nowProgress) {
    //   return;
    // }

    if (message.trim() !== "") {
      const mes = "[iroiroBot]\nfrom\n" + name + "\n\nmessage\n" + message;
      //  setNowProgress(true);
      try {
        if (sendpub) {
          await sendMessage(mes, sendpub);

          setOpenSnackbar({
            isopen: true,
            type: "success",
            message: "Thank you for reaching out!",
          });
        } else {
          throw error;
        }
      } catch (error) {
        setOpenSnackbar({
          isopen: true,
          type: "error",
          message: "Failed to send your message. Please try again later.",
        });
      }
    }
  };

  const handleInputChange = (e: any) => {
    if (e.target.value.trim() !== "") {
      setError(false);
    }
    setMessage(e.target.value);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Feedback
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 6,
          maxWidth: "90%",
        }}
      >
        <Grid container spacing={2} flexDirection="column" alignItems="center">
          <Typography
            sx={{ fontSize: 14, textAlign: "center" }}
            color="text.secondary"
            gutterBottom
          >
            Your message will be sent via encrypted DM using a randomly
            generated key.
          </Typography>
          <Grid
            item
            width={600}
            maxWidth={"90%"}
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              placeContent: "center",
              overflowY: "auto",
              fontSize: "small",
            }}
          >
            <TextField
              fullWidth
              type="text"
              placeholder="name (not required)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          <Grid
            width={600}
            maxWidth={"90%"}
            item
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",

              overflowY: "auto",
              fontSize: "small",
            }}
          >
            <TextField
              fullWidth
              placeholder="message"
              value={message}
              multiline
              rows={6}
              onChange={handleInputChange}
              error={error}
              helperText={
                error
                  ? `Message is required and must be less than ${MAX_MESSAGE_LENGTH} characters`
                  : ""
              }
              inputProps={{ maxLength: MAX_MESSAGE_LENGTH }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              type="submit"
              onClick={handleSendMessage}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
