import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

function DescriptionCard({page}) {
    return (
        <Card sx={{height: 400 }} >
            <CardActionArea
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'left',
                    height: '100%'
                }}
                href={page.links}
            >
                <CardMedia
                    component="img"
                    sx={{ width: 200, height: 200, paddingTop: 1 }}
                    image={page.image_urls || 'https://placehold.co/400?text=No Image'}
                    alt={page.titles}
                />
                <CardContent>
                    <Typography gutterBottom variant="subtitle2">
                        {page.titles}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {page.short_descriptions}
                    </Typography>
                </CardContent>
            </CardActionArea >
        </Card>
    );
}

export default DescriptionCard;