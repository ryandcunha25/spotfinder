import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


const VenueDetails = () => {
    let { venueId } = useParams(); // Capture venueId from URL
    // venueId = parseInt(venueId)
    const [venue, setVenue] = useState(null);


    useEffect(() => {
        const fetchVenueDetails = async () => {
            try {
                console.log(venueId); // Verify this prints the expected ID
                const response = await fetch(`http://localhost:5000/venues/${venueId}`);

                if (response.ok) {
                    const data = await response.json();
                    setVenue(data);
                } else {
                    console.error('Venue not found or error occurred');
                }
            } catch (error) {
                console.error('Error fetching venue details:', error);
            }
        };

        fetchVenueDetails();
    }, [venueId]);

    return venue ? (
        <div>
            <h1>{venue.name}</h1>
            <p>{venue.description}</p>
            <img src={require(`./Assets/${venue.image_url}`)}alt={venue.name} />
            <p>Location: {venue.location}</p>
            <p>Price: ₹{venue.price}</p>
            <p>Capacity: {venue.capacity} people</p>
        </div>
    ) : (
        <p>Loading venue details...</p>
    );
};

export default VenueDetails;
