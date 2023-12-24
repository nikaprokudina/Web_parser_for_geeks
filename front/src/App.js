import DescriptionCard from "./components/DescriptionCard";
import BookDescriptionCard from "./components/BookDescriptionCard";
import {useDebugValue, useEffect, useState} from "react";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Slider from "@mui/material/Slider";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import AppBar from "@mui/material/AppBar";
import OutlinedInput from "@mui/material/OutlinedInput";
import Toolbar from "@mui/material/Toolbar";
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Search from '@mui/icons-material/Search';
import FilterList from '@mui/icons-material/FilterList';
import Grid from '@mui/material/Unstable_Grid2';
import Tooltip from '@mui/material/Tooltip';
import {Menu as MenuIcon} from '@mui/icons-material';
import Checkbox from "@mui/material/Checkbox";
import Menu from "@mui/material/Menu";
import MenuItem from '@mui/material/MenuItem';
import { Autocomplete } from "@mui/material";

function App() {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [bookData, setBookData] = useState([]);
    const [tabletopData, setTabletopData] = useState([]);
    const [size, setSize] = useState(12);
    const [timeoutId, setTimeoutId] = useState(0);
    const [playerCount, setPlayerCount] = useState([2, 3]);
    const [playTime, setPlayTime] = useState([0, 450]);
    const [age, setAge] = useState(0);
    const [playerCountEnabled, setPlayerCountEnabled] = useState(false);
    const [playTimeEnabled, setPlayTimeEnabled] = useState(false);
    const [ageEnabled, setAgeEnabled] = useState(false);
    const [latest, setLatest] = useState(false);
    const [playerChoice, setPlayerChoice] = useState(false);
    const [teseraChoice, setTeseraChoice] = useState(false);
    const [bggChoice, setBggChoice] = useState(false);
    const [open, setOpen] = useState(false);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [genre, setGenre] = useState(null);
    const [genreOptions, setGenreOptions] = useState([]);
    const [theme, setTheme] = useState('tabletop');

    async function FetchBookGenres() {
        const response = await fetch(process.env.REACT_APP_API_URL + 'book_genres/')
        if (response.ok) {
            const content = await response.json();
            if (response.status === 200) {
                setGenreOptions(content.data)
            }
        }
    }
    
    useEffect(() => {
        FetchBookGenres()
    }, [])

    async function SearchTabletop() {
        setLoading(true)
        clearTimeout(timeoutId)
        const params = {
            page: page - 1,
            size: size,
        }
        if (search) {
            params['search'] = search
        }
        if (open) {
            if (playerCountEnabled) {
                params['min_players'] = playerCount[0]
                params['max_players'] = playerCount[1]
            }
            if (playTimeEnabled) {
                params['min_play_time'] = playTime[0]
                params['max_play_time'] = playTime[1]
            }
            if(ageEnabled) {
                params['age'] = age
            }
            if(playerChoice) {
                params['player_choice'] = true
            }
            if(teseraChoice) {
                params['tesera_choice'] = true
            }
            if(bggChoice) {
                params['bgg_choice'] = true
            }
        }
        const response = await fetch(process.env.REACT_APP_API_URL + 'list_tabletop/?' + new URLSearchParams(params))
        if (response.ok) {
            const content = await response.json();
            if (response.status === 200) {
                setTabletopData(content.data)
                setTotal(content.total + 1)
                setLoading(false)
            }
            if (response.status === 202) {
                setTimeoutId(setTimeout(Search, Number(process.env.REACT_APP_FETCH_TIMEOUT)))
            }
        }
    }

    async function SearchBooks() {
        setLoading(true)
        clearTimeout(timeoutId)
        const params = {
            page: page - 1,
            size: size,
        }
        if (search) {
            params['search'] = search
        }
        if (open && genre) {
            params['genre'] = genre
        }
        const response = await fetch(process.env.REACT_APP_API_URL + 'list_books/?' + new URLSearchParams(params))
        if (response.ok) {
            const content = await response.json();
            if (response.status === 200) {
                setBookData(content.data)
                setTotal(content.total + 1)
                setLoading(false)
            }
            if (response.status === 202) {
                setTimeoutId(setTimeout(Search, Number(process.env.REACT_APP_FETCH_TIMEOUT)))
            }
        }
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handlePageChange = (e, value) => {
        setPage(value)
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
    }

    const handlePlayerCountChange = (event, newPlayerCount) => {
        setPlayerCount(newPlayerCount);
    };

    const handlePlayTimeChange = (event, newPlayTime) => {
        setPlayTime(newPlayTime);
    };

    const handleAgeChange = (e) => {
        setAge(e.target.value)
    };

    const handleLatestChange = (e) => {
        setLatest(e.target.value)
    };

    const handlePlayerChoiceChange = (e) => {
        setPlayerChoice(e.target.checked)
    };

    const handleTeseraChoiceChange = (e) => {
        setTeseraChoice(e.target.checked)
    };

    const handleBggChoiceChange = (e) => {
        setBggChoice(e.target.checked)
    }

    const SearchAny = () => {
        if (theme === 'tabletop') {
            SearchTabletop().then()
        } else if (theme === 'book') {
            SearchBooks().then()
        }
    }

    const handleSearchClick = () => {
        setPage(1)
        SearchAny()
    };

    const handleAdvancedSearchClick = () => {
        setOpen(!open);
    };

    const handleNavTabletopClick = () => {
        setTheme('tabletop')
        setAnchorElNav(null)
    };

    const handleNavBookClick = () => {
        setTheme('book')
        setAnchorElNav(null)
    };

    useEffect(() => {
        SearchAny()
    }, [page, size, theme])

    const tabletopCards = [];
    const bookCards = [];

    for (const page of tabletopData) {
        tabletopCards.push(
            <Grid xs = {12} sm = {6} md = {4} lg = {3}>
                <DescriptionCard page={page}/>
            </Grid>
        );
    }

    for (const page of bookData) {
        bookCards.push(
            <Grid xs = {12} sm = {6} md = {4} lg = {3}>
                <BookDescriptionCard page={page}/>
            </Grid>
        );
    }

    return (
        <Container maxWidth={false} disableGutters align = "center">
            <AppBar position="sticky" >
                <Toolbar>
                    <Typography
                        sx={{ display: { xs: 'none', md: 'block' } }}
                        position="fixed"
                        align="left"
                        variant="h6"
                        component="h1"
                    >
                        Web Parser for {theme === 'tabletop' ? 'Tabletops' : ''}{theme === 'book' ? 'Books' : ''}
                    </Typography>
                    <Box
                        sx = {{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                    >
                        <OutlinedInput
                            
                            sx={{
                                height: '40px',
                                maxWidth: '600px',
                                "&.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "lightgrey"
                                },
                                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "white"
                                },    
                                "& input::placeholder": {
                                    color: "white"
                                },
                                color:'white'
                            }}
                            onKeyUp={(event) => {
                                if (event.key === 'Enter')
                                    handleSearchClick()
                            }}
                            placeholder="Поиск"
                            variant="outlined"
                            onChange={handleSearchChange}
                        />
                        <IconButton
                            size="large"
                            onClick={handleSearchClick}
                        >
                            <Search style={{ color: '#fff' }}/>
                        </IconButton>
                        <Tooltip title="Расширенный поиск">
                            <IconButton
                                size="large"
                                onClick={handleAdvancedSearchClick}
                            >
                                {open ? <FilterList /> : <FilterList style={{ color: '#fff' }}/>}
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box
                        position="relative"
                        justifySelf="end"
                    >
                        <Tooltip title="Меню">
                            <IconButton
                                size="large"
                                onClick={handleOpenNavMenu}
                            >
                                {Boolean(anchorElNav) ? <MenuIcon /> : <MenuIcon style={{ color: '#fff' }}/>}
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                        >
                            <MenuItem onClick={handleNavTabletopClick}>
                                <Typography textAlign="center">Настолки</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleNavBookClick}>
                                <Typography textAlign="center">Книги</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Collapse
                in={open}
                timeout="auto"
                unmountOnExit 
                sx={{ width: '100%', bgcolor: 'background', boxShadow: 2,}}
                disablePadding
            >
                {theme === "tabletop" ? (
                    <Grid container spacing={2} m={2} maxWidth='800px'>
                        <Grid xs={12} md={4}>
                            <Stack direction={"row"} alignItems={'center'}>
                                <Checkbox
                                    checked={playerChoice}
                                    onChange={handlePlayerChoiceChange}
                                />
                                <Typography>
                                    Оценка игроков 8+
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={12} md={3}>
                            <Stack direction={"row"} alignItems={'center'}>
                                <Checkbox
                                    checked={teseraChoice}
                                    onChange={handleTeseraChoiceChange}
                                />
                                <Typography>
                                    Оценка Tesera 8+
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={12} md={5}>
                            <Stack direction={"row"} alignItems={'center'}>
                                <Checkbox
                                    checked={bggChoice}
                                    onChange={handleBggChoiceChange}
                                />
                                <Typography>
                                    Оценка BoardGameGeek 8+
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={5} md={3}>
                            <Stack direction={"row"} alignItems={'center'}>
                                <Checkbox
                                    checked={playerCountEnabled}
                                    onChange={(e) => setPlayerCountEnabled(e.target.checked)}
                                />
                                <Typography>
                                    Число игроков:
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={7} md={3}>
                            <Slider
                                disabled = {!playerCountEnabled}
                                value={playerCount}
                                onChange={handlePlayerCountChange}
                                valueLabelDisplay="auto"
                                marks
                                min={1}
                                max={32}
                            />
                        </Grid>
                        <Grid xs={5} md={3}>
                            <Stack direction={"row"} alignItems={'center'}>
                                <Checkbox
                                    checked={ageEnabled}
                                    onChange={(e) => setAgeEnabled(e.target.checked)}
                                />
                                <Typography>
                                    Возраст:
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={7} md={3}>
                            <Slider
                                disabled = {!ageEnabled}
                                valueLabelFormat={(value) => value + "+"}
                                value={age}
                                onChange={handleAgeChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={21}
                                step={1}
                            />
                        </Grid>
                        <Grid xs={5} md={3}>
                            <Stack direction={"row"} alignItems={'center'}>
                                <Checkbox
                                    checked={playTimeEnabled}
                                    onChange={(e) => setPlayTimeEnabled(e.target.checked)}
                                />
                                <Typography>
                                    Время игры:
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid xs={7} md={9}>
                            <Slider
                                disabled = {!playTimeEnabled}
                                value={playTime}
                                onChange={handlePlayTimeChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={450}
                                step={10}
                            />
                        </Grid>
                    </Grid>
                ) : (<></>)}
            
                {theme === "book" ? (
                    <Grid container spacing={2} m={2} maxWidth='400px'>
                        <Grid xs={12}>
                            <Autocomplete
                                options={genreOptions}
                                onChange={(event, newValue) => {
                                    setGenre(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label="Жанр" />}
                            />
                        </Grid>
                    </Grid>
                ) : (<></>)}
            </Collapse>
            {loading ? (
                <Box my={4}>
                    <CircularProgress color="inherit"/>
                </Box>) : (
                <Box my={4}>
                    <Grid container spacing={2} m={1}>
                        {theme === 'tabletop' ? tabletopCards : (<></>)}
                        {theme === 'book' ? bookCards : (<></>)}
                    </Grid>
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={1}
                    >
                    </Stack>
                    <Pagination
                        count={total}
                        page={page}
                        onChange={handlePageChange}
                        sx={{display:"flex", justifyContent:"center", padding: "20px"}}
                    />
                </Box>
            )}
        </Container>
    );
}

export default App;
