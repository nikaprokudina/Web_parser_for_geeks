import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

function BookDescriptionCard({page}) {
    console.log(page)
    return (
        <Card sx={{height: 300 }} >
            <CardActionArea
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'left',
                    height: '100%'
                }}
                href={page.book_path}
            >
                <CardMedia
                    component="img"
                    sx={{ width: 200, height: 200, paddingTop: 1 }}
                    image={page.image_src || 'https://placehold.co/400?text=No Image'}
                    alt={page.title}
                />
                <CardContent>
                    <Typography gutterBottom variant="subtitle2">
                        {page.title}, {page.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Жанры: {page.genres.join(", ")}
                    </Typography>
                </CardContent>
            </CardActionArea >
        </Card>
    );
}

export default BookDescriptionCard;