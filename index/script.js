let map;
let selectedMarker = null;
let selectedSpot = null;
let markers = [];
let currentRating = 5;

// UBC campus center coordinates
const UBC_CENTER = { lat: 49.2606, lng: -123.2460 };

// Study spots with REAL coordinates from Google Maps
let studySpots = [
    {
        id: 1,
        name: "Irving K. Barber Learning Centre",
        lat: 49.26759,
        lng: -123.25393,
        seats: 800,
        noise: "Quiet",
        outlets: true,
        rating: 4.5,
        location: "1961 East Mall",
        hours: "24/7",
        reviews: [
            { user: "Alex", rating: 5, comment: "Great for late night studying! Open 24/7 is a lifesaver during finals." },
            { user: "Sarah", rating: 4, comment: "Lots of space but can get crowded during exams." }
        ]
    },
    {
        id: 2,
        name: "Koerner Library",
        lat: 49.26784,
        lng: -123.25434,
        seats: 300,
        noise: "Very Quiet",
        outlets: true,
        rating: 4.7,
        location: "1958 Main Mall",
        hours: "8am - 12am",
        reviews: [
            { user: "Mike", rating: 5, comment: "Perfect silent study environment! Love the study carrels." }
        ]
    },
    {
        id: 3,
        name: "Life Sciences Centre",
        lat: 49.26381,
        lng: -123.25209,
        seats: 150,
        noise: "Moderate",
        outlets: true,
        rating: 4.2,
        location: "2350 Health Sciences Mall",
        hours: "7am - 11pm",
        reviews: []
    },
    {
        id: 4,
        name: "AMS Student Nest",
        lat: 49.26681,
        lng: -123.24960,
        seats: 80,
        noise: "Moderate",
        outlets: true,
        rating: 4.6,
        location: "6331 Crescent Road",
        hours: "7am - 11pm",
        reviews: [
            { user: "Jordan", rating: 5, comment: "Love the cozy atmosphere! Great for group study." }
        ]
    },
    {
        id: 5,
        name: "Buchanan Tower",
        lat: 49.26921,
        lng: -123.25462,
        seats: 200,
        noise: "Quiet",
        outlets: false,
        rating: 4.0,
        location: "1873 East Mall",
        hours: "8am - 10pm",
        reviews: []
    },
    {
        id: 6,
        name: "Sauder Building",
        lat: 49.26449,
        lng: -123.25359,
        seats: 120,
        noise: "Moderate",
        outlets: true,
        rating: 4.3,
        location: "2053 Main Mall",
        hours: "7am - 9pm",
        reviews: []
    },
    {
        id: 7,
        name: "Woodward Library (IRC)",
        lat: 49.26278,
        lng: -123.25278,
        seats: 250,
        noise: "Very Quiet",
        outlets: true,
        rating: 4.8,
        location: "2198 Health Sciences Mall",
        hours: "8am - 11pm",
        reviews: []
    },
    {
        id: 8,
        name: "IKBLC Learning Commons",
        lat: 49.26759,
        lng: -123.25393,
        seats: 400,
        noise: "Quiet",
        outlets: true,
        rating: 4.6,
        location: "1961 East Mall (Lower Level)",
        hours: "24/7",
        reviews: []
    }
];

function initMap() {
    // Initialize map centered on UBC
    map = new google.maps.Map(document.getElementById('map'), {
        center: UBC_CENTER,
        zoom: 15,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    // Create markers for each study spot
    studySpots.forEach(spot => {
        createMarker(spot);
    });
}

function createMarker(spot) {
    const marker = new google.maps.Marker({
        map: map,
        position: { lat: spot.lat, lng: spot.lng },
        title: spot.name,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#667eea",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2
        }
    });

    markers.push({ marker, spot });

    marker.addListener('click', () => {
        selectSpot(marker, spot);
    });
}

function selectSpot(marker, spot) {
    // Reset previous selection
    if (selectedMarker) {
        selectedMarker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#667eea",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2
        });
    }

    // Highlight selected marker
    marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#FF93A9",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3
    });

    selectedMarker = marker;
    selectedSpot = spot;

    // Display spot details
    displaySpotDetails(spot);
}

function displaySpotDetails(spot) {
    // Hide placeholder, show details
    document.getElementById('placeholder').style.display = 'none';
    document.getElementById('details').style.display = 'block';
    
    // Update spot information
    document.getElementById('spot-name').textContent = spot.name;
    document.getElementById('spot-rating').innerHTML = 
        '⭐'.repeat(Math.round(spot.rating)) + ' ' + spot.rating;
    document.getElementById('spot-seats').textContent = spot.seats;
    document.getElementById('spot-noise').textContent = spot.noise;
    document.getElementById('spot-outlets').textContent = spot.outlets ? 'Yes' : 'No';
    document.getElementById('spot-outlet-icon').textContent = spot.outlets ? '🔌' : '❌';
    document.getElementById('spot-location').textContent = spot.location;
    document.getElementById('spot-hours').textContent = spot.hours;
    
    // Update reviews
    document.getElementById('review-count').textContent = spot.reviews.length;
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = '';
    
    if (spot.reviews.length === 0) {
        reviewsList.innerHTML = '<p style="color: #999;">No reviews yet. Be the first to review!</p>';
    } else {
        spot.reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review';
            reviewDiv.innerHTML = `
                <strong>${review.user}</strong> ${'⭐'.repeat(review.rating)}
                <p>${review.comment}</p>
            `;
            reviewsList.appendChild(reviewDiv);
        });
    }

    // Hide review form if it was open
    document.getElementById('review-form').style.display = 'none';
    document.getElementById('add-review-btn').style.display = 'block';
}

// Set up event listeners
window.addEventListener('load', () => {
    // Add Review button
    document.getElementById('add-review-btn').onclick = () => {
        document.getElementById('add-review-btn').style.display = 'none';
        document.getElementById('review-form').style.display = 'block';
        currentRating = 5;
        updateStars();
    };
    
    // Cancel button
    document.getElementById('cancel-review').onclick = () => {
        document.getElementById('review-form').style.display = 'none';
        document.getElementById('add-review-btn').style.display = 'block';
        document.getElementById('review-comment').value = '';
    };
    
    // Submit review button
    document.getElementById('submit-review').onclick = submitReview;
    
    // Star rating selector
    document.querySelectorAll('#star-selector span').forEach(star => {
        star.onclick = (e) => {
            currentRating = parseInt(e.target.dataset.rating);
            updateStars();
        };
    });
});

// Update star display
function updateStars() {
    document.querySelectorAll('#star-selector span').forEach((star, index) => {
        if (index < currentRating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

// Submit a new review
function submitReview() {
    const comment = document.getElementById('review-comment').value;
    
    if (!comment.trim()) {
        alert('Please write a comment!');
        return;
    }
    
    const newReview = {
        user: 'Anonymous',
        rating: currentRating,
        comment: comment
    };
    
    // Add review to the spot
    selectedSpot.reviews.push(newReview);
    
    // Recalculate average rating
    const totalRating = selectedSpot.reviews.reduce((sum, r) => sum + r.rating, 0);
    selectedSpot.rating = (totalRating / selectedSpot.reviews.length).toFixed(1);
    
    // Update the spot in the array
    studySpots = studySpots.map(s => 
        s.id === selectedSpot.id ? selectedSpot : s
    );
    
    // Refresh the display
    displaySpotDetails(selectedSpot);
    
    // Clear form
    document.getElementById('review-comment').value = '';
    currentRating = 5;
    
    alert('Review added! ✅');
}