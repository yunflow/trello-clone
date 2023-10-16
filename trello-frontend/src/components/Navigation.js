import { AppBar, Box, Button, Toolbar, Typography, Link } from "@mui/material";

function Navigation() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Trello by Group 11
                    </Typography>

                    <Button color="inherit" >
                        <Link href="/login" underline="hover" color="inherit">
                            Login
                        </Link>
                    </Button>

                    <Button color="inherit">
                        <Link href="/signup" underline="hover" color="inherit">
                            Signup
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navigation;