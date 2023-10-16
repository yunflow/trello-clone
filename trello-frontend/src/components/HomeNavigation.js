import { AppBar, Box, Button, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "@mui/material";
import storage from "../lib/localStorage";


function HomeNavigation() {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 0, display: "flex", ml: 4 }}>
                        <Button sx={{ color: "white", fontWeight: "bold" }}>
                            {/* go to user dashbord */}
                            <Link href="/home" color="inherit" underline="hover">Workspace</Link>
                        </Button>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: "flex", ml: 4 }}>
                        <Button sx={{ color: "white", fontWeight: "bold" }}>
                            {/* go to user dashbord */}
                            <Link href="/create-workspace" color="inherit" underline="hover">Create Workspace</Link>
                        </Button>
                    </Box>

                    {/* when log out, delete the storage */}
                    <Button color="inherit" onClick={() => {storage.remove("user")}}>
                        <Link href="/login" color="inherit" underline="hover">
                            {"Log out"}
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default HomeNavigation;