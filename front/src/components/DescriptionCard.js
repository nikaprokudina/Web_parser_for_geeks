import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { CardActionArea } from '@mui/material';

function DescriptionCard({page}) {
    console.log(page)
    return (
        <Card sx={{ width: 800, height: 200 }}>
            <CardActionArea
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'left',
                    width: 800,
                    height: 200,
                }}
                href={page.links}
            >
                <CardMedia
                    component="img"
                    sx={{ width: 200, height: 200 }}
                    image={page.image_urls || 'https://placehold.co/400?text=No Image'}
                    alt={page.titles}
                />
                <CardContent
                    sx={{ width: 600, height: 160, margin: '20px' }}
                >
                    <Typography gutterBottom variant="h5" component="div">
                        {page.titles}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {page.short_descriptions}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default DescriptionCard;