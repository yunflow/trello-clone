import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";

function HomePage(){

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Link to='' style={{textDecoration: 'none', color: 'white'}}>
                        <Typography variant="h6" component="div" sx={{padding: '0 8px'}}>
                            Workspace
                        </Typography>
                    </Link>
                    <Button href='/CreateWorkspacePage' style={{textDecoration: 'none', color: 'white'}}>
                        <Typography variant="h6" component="div" sx={{padding: '0 8px'}}>
                            Create Workspace
                        </Typography>
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
        
    );
}
export default HomePage;
