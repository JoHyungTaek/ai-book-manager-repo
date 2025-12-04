// src/layout/Layout.jsx
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

export default function Layout({ children }) {
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">AI Book Manager</Typography>
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ flex: 1, py: 4 }}>
                <Container maxWidth="md">{children}</Container>
            </Box>

            <Box component="footer" sx={{ py: 2, textAlign: "center", borderTop: "1px solid #eee" }}>
                © 2025 AIVLE Book Manager
            </Box>
        </Box>
    );
}