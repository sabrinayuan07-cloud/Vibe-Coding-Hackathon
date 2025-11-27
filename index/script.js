// YOUR STUDY SPOTS DATA - ADD MORE SPOTS HERE!
let studySpots = [
    {
        id: 1,
        name: "Irving K. Barber Learning Centre",
        seats: 800,
        noise: "Quiet",
        outlets: true,
        rating: 4.5,
        x: 30,  // Position on map (0-100%)
        y: 40,
        reviews: [
            { user: "Alex", rating: 5, comment: "Great for late night studying!" },
            { user: "Sarah", rating: 4, comment: "Lots of space but can get crowded during exams" }
        ]
    },
    {
        id: 2,
        name: "Koerner Library",
        seats: 300,
        noise: "Very Quiet",
        outlets: true,
        rating: 4.7,
        x: 50,
        y: 30,
        reviews: [
            { user: "Mike", rating: 5, comment: "Perfect silent study environment!" }
        ]
    },
    {
        id: 3,
        name: "Life Sciences Centre",
        seats: 150,
        noise: "Moderate",
        outlets: true,
        rating: 4.2,
        x: 70,
        y: 60,
        reviews: []
    },
    {
        id: 4,
        name: "Nest Study Rooms",
        seats: 80,
        noise: "Quiet",
        outlets: true,
        rating: 4.6,
        x: 25,
        y: 70,
        reviews: []
    },
    // ADD MORE SPOTS HERE!
];

let selectedSpot = null;
let currentRating = 5;

// Initialize the map when page loads
window.onload = function() {
    renderPins();
    setupEventListeners();
};

// Create pins on the map
function renderPins() {
    const map = document.getElementById('map');
    map.innerHTML = ''; // Clear existing pins
    
    studySpots.forEach(spot => {
        const pin = document.createElement('div');
        pin.className = 'pin';
        pin.innerHTML = '📍';
        pin.style.left = spot.x + '%';
        pin.style.top = spot.y + '%';
        pin.onclick = () => selectSpot(spot.id);
        map.appendChild(pin);
    });
}

// When user clicks a pin
function selectSpot(spotId) {
    selectedSpot = studySpots.find(s => s.id === spotId);
    
    // Update active pin
    document.querySelectorAll('.pin').forEach((pin, index) => {
        if (studySpots[index].id === spotId) {
            pin.classList.add('active');
        } else {
            pin.classList.remove('active');
        }
    });
    
    // Show details, hide placeholder
    document.getElementById('placeholder').style.display = 'none';
    document.getElementById('details').style.display = 'block';
    
    // Hide review form if it was open
    document.getElementById('review-form').style.display = 'none';
    document.getElementById('add-review-btn').style.display = 'block';
    
    // Update spot details
    document.getElementById('spot-name').textContent = selectedSpot.name;
    document.getElementById('spot-rating').innerHTML = 
        '⭐'.repeat(Math.round(selectedSpot.rating)) + ' ' + selectedSpot.rating;
    document.getElementById('spot-seats').textContent = selectedSpot.seats;
    document.getElementById('spot-noise').textContent = selectedSpot.noise;
    document.getElementById('spot-outlets').textContent = selectedSpot.outlets ? 'Yes' : 'No';
    document.getElementById('spot-outlet-icon').textContent = selectedSpot.outlets ? '🔌' : '❌';
    
    // Update reviews
    document.getElementById('review-count').textContent = selectedSpot.reviews.length;
    const reviewsList = document.getElementById('reviews-list');
    reviewsList.innerHTML = '';
    
    if (selectedSpot.reviews.length === 0) {
        reviewsList.innerHTML = '<p style="color: #999;">No reviews yet. Be the first to review!</p>';
    } else {
        selectedSpot.reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.className = 'review';
            reviewDiv.innerHTML = `
                <strong>${review.user}</strong> ${'⭐'.repeat(review.rating)}
                <p>${review.comment}</p>
            `;
            reviewsList.appendChild(reviewDiv);
        });
    }
}

// Set up all button click handlers
function setupEventListeners() {
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
}

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
    selectSpot(selectedSpot.id);
    
    // Clear form
    document.getElementById('review-comment').value = '';
    currentRating = 5;
    
    alert('Review added! ✅');
}