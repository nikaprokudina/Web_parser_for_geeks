import DescriptionCard from "./components/DescriptionCard";
import {useEffect, useState} from "react";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Slider from "@mui/material/Slider";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

function App() {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState('');
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [size, setSize] = useState(4);
    const [timeoutId, setTimeoutId] = useState(0);
    const [playerCount, setPlayerCount] = useState([1, 32]);
    const [playTime, setPlayTime] = useState([0, 1200]);

    async function Search() {
        setLoading(true)
        setProgress('')
        clearTimeout(timeoutId)
        const response = await fetch(process.env.REACT_APP_API_URL + 'list/?' + new URLSearchParams({
            page: page - 1,
            size: size,
            search: search,
            min_players: playerCount[0],
            max_players: playerCount[1],
            min_play_time: playTime[0],
            max_play_time: playTime[1],
        }))
        if (response.ok) {
            const content = await response.json();
            if (response.status === 200) {
                setData(content.data)
                setTotal(content.total + 1)
                setLoading(false)
            }
            if (response.status === 202) {
                setTimeoutId(setTimeout(Search, Number(process.env.REACT_APP_FETCH_TIMEOUT)))
                setProgress(content.progress)
            }
        }
    }

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

    const handleSearchClick = () => {
        setPage(1)
        Search().then()
    };

    useEffect(() => {
        Search().then()
    }, [page, size])

    const cards = [];

    for (const page of data) {
        cards.push(
            <DescriptionCard page={page} />
        );
    }

    return (
        <Container maxWidth={false} align = "center">
            <Stack
                sx = {{
                    width: 800,
                    margin: '40px'
                }}
                direction="column"
                justifyContent="space-around"
                alignItems="stretch"
                spacing={3}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom my={4}
                    >
                    Крутой парсер настолок в сети интернет
                </Typography>
                <TextField
                    id="outlined-basic"
                    label="Поиск"
                    variant="outlined"
                    onChange={handleSearchChange}
                />
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                >
                    <Typography
                        sx = {{
                            width: 200
                        }}
                        variant="body1"
                        >
                        Число игроков:
                    </Typography>
                    <Slider
                        value={playerCount}
                        onChange={handlePlayerCountChange}
                        valueLabelDisplay="auto"
                        marks
                        min={1}
                        max={32}
                    />
                </Stack>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                >
                    <Typography
                        sx = {{
                            width: 200
                        }}
                        variant="body1"
                        >
                        Время игры:
                    </Typography>
                    <Slider
                        value={playTime}
                        onChange={handlePlayTimeChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1200}
                        step={10}
                    />
                </Stack>
                <Button
                    onClick={handleSearchClick}>
                    Найти настолки!
                </Button>
            </Stack>
            {loading ? (
                <Box my={4}>
                    <CircularProgress color="inherit"/>
                    <Typography level="h2" fontSize="lg" gutterBottom my={4}>
                        {progress}
                    </Typography>
                </Box>) : (
                <Box>
                    <Stack
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={1}
                    >
                    {cards}
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
