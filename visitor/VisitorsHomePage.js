// //
// document.getElementById('toggle-mode')?.addEventListener('click', () => {
//   document.body.classList.toggle('dark-mode');
//   document.body.classList.toggle('light-mode');
// });

// function scrollToSection(id) {
//   document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
// }

// // Load "My Ratings" section
// function loadMyRatings() {
//   const list = document.getElementById('ratingsList');
//   const empty = document.getElementById('noRatings');
//   if (!list) return;

//   // Simulate API call with mock data
//   setTimeout(() => {
//     const mockData = [
//       {
//         TicketID: 'ABC123',
//         Museum: 'National Museum',
//         Date: '2025-01-15',
//         Time: '10:00',
//         Rating: '4',
//         Review: 'Great experience, learned a lot about history!'
//       },
//       {
//         TicketID: 'DEF456',
//         Museum: 'Salar Jung Museum',
//         Date: '2024-12-20',
//         Time: '14:00',
//         Rating: '5',
//         Review: 'Amazing collection of artifacts!'
//       }
//     ];

//     if (mockData.length === 0) {
//       list.innerHTML = '';
//       if (empty) empty.style.display = 'block';
//       return;
//     }

//     if (empty) empty.style.display = 'none';

//     // Sort newest first by Date
//     mockData.sort((a, b) => new Date(b.Date) - new Date(a.Date));

//     list.innerHTML = mockData.map(b => {
//       const rating = parseInt(b.Rating) || 0;
//       const hasRating = rating > 0;
//       const stars = hasRating ? ('★'.repeat(rating) + '☆'.repeat(5 - rating)) : '☆☆☆☆☆';
//       const reviewHtml = hasRating && b.Review ? `<p class="rating-review">${b.Review}</p>` : '';
//       const actionHtml = hasRating ? '' : `<button class="review-btn" onclick="openReviewModal('${b.TicketID}', '${b.Museum}')">Rate now</button>`;
//       return `
//         <div class="booking-card rating-card">
//           <div class="rating-header">
//             <h4>${b.Museum}</h4>
//             <span class="stars">${stars}</span>
//           </div>
//           <div class="rating-meta">
//             <span><i class="fas fa-calendar"></i> ${b.Date || '-'}</span>
//             <span><i class="fas fa-clock"></i> ${b.Time || '-'}</span>
//           </div>
//           ${reviewHtml}
//           ${actionHtml}
//         </div>`;
//     }).join('');
//   }, 500);
// }

// // Load Exhibitions with Server-Side Pagination
// const exhibitsState = { page: 1, per_page: 9, total_pages: 1, total: 0, items: [] };

// async function loadExhibitions(page = 1) {
//   const container = document.getElementById('exhibits-container');
//   const nav = document.getElementById('exhibits-nav');
  
//   // Simulate API call with mock data
//   setTimeout(() => {
//     const mockData = {
//       items: [
//         {
//           Name: 'National Museum',
//           City: 'Delhi',
//           State: 'Delhi',
//           Type: 'History',
//           Established: '1949'
//         },
//         {
//           Name: 'Indian Museum',
//           City: 'Kolkata',
//           State: 'West Bengal',
//           Type: 'History',
//           Established: '1814'
//         },
//         {
//           Name: 'Salar Jung Museum',
//           City: 'Hyderabad',
//           State: 'Telangana',
//           Type: 'Art',
//           Established: '1951'
//         },
//         {
//           Name: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya',
//           City: 'Mumbai',
//           State: 'Maharashtra',
//           Type: 'History',
//           Established: '1922'
//         },
//         {
//           Name: 'Government Museum',
//           City: 'Chennai',
//           State: 'Tamil Nadu',
//           Type: 'Science',
//           Established: '1851'
//         },
//         {
//           Name: 'National Gallery of Modern Art',
//           City: 'Delhi',
//           State: 'Delhi',
//           Type: 'Art',
//           Established: '1954'
//         }
//       ],
//       page: 1,
//       per_page: 9,
//       total: 6,
//       total_pages: 1
//     };

//     exhibitsState.items = mockData.items || [];
//     exhibitsState.page = mockData.page || page;
//     exhibitsState.per_page = mockData.per_page || exhibitsState.per_page;
//     exhibitsState.total = mockData.total || exhibitsState.items.length;
//     exhibitsState.total_pages = mockData.total_pages || 1;

//     renderExhibits();
//     renderExhibitsPagination();

//     // Wire modal close
//     document.getElementById('closeModal')?.addEventListener('click', () => {
//       const modal = document.getElementById('exhibitModal');
//       if (modal) modal.style.display = 'none';
//     });
//   }, 500);
// }

// function renderExhibits() {
//   const container = document.getElementById('exhibits-container');
//   if (!container) {
//     console.warn('exhibits-container element not found in DOM');
//     return;
//   }
//   container.innerHTML = '';
//   exhibitsState.items.forEach((exhibit, index) => {
//     const card = document.createElement('div');
//     card.className = 'exhibit-card';
//     card.innerHTML = `
//       <h4>${exhibit.Name}</h4>
//       <p><strong>City:</strong> ${exhibit.City}</p>
//       <p><strong>State:</strong> ${exhibit.State}</p>
//       <p><strong>Type:</strong> ${exhibit.Type}</p>
//       <button class="details-btn" data-index="${index}">View Details</button>
//     `;
//     container.appendChild(card);
//   });

//   // Modal logic is handled by a single global delegated listener below
// }

// function renderExhibitsPagination() {
//   const nav = document.getElementById('exhibits-nav');
//   if (!nav) return;
//   nav.innerHTML = '';

//   const { page, total_pages } = exhibitsState;

//   const createButton = (text, pageNum, disabled = false, active = false) => {
//     const btn = document.createElement('button');
//     btn.textContent = text;
//     btn.disabled = disabled;
//     btn.className = 'page-btn';
//     if (active) btn.classList.add('active');
//     btn.addEventListener('click', () => loadExhibitions(pageNum));
//     return btn;
//   };

//   // Prev
//   nav.appendChild(createButton('Prev', page - 1, page === 1));

//   const maxVisible = 3;
//   const pageList = [];

//   if (total_pages <= 6) {
//     for (let i = 1; i <= total_pages; i++) pageList.push(i);
//   } else {
//     pageList.push(1);
//     if (page > maxVisible) pageList.push('...');
//     const start = Math.max(2, page - 1);
//     const end = Math.min(total_pages - 1, page + 1);
//     for (let i = start; i <= end; i++) pageList.push(i);
//     if (page + 1 < total_pages - 1) pageList.push('...');
//     pageList.push(total_pages);
//   }

//   pageList.forEach(p => {
//     if (p === '...') {
//       const span = document.createElement('span');
//       span.textContent = '...';
//       span.className = 'dots';
//       nav.appendChild(span);
//     } else {
//       nav.appendChild(createButton(p, p, false, p === page));
//     }
//   });

//   // Next
//   nav.appendChild(createButton('Next', page + 1, page === total_pages));
// }

// // Initial load
// loadExhibitions(1);

// // Global delegated handler for exhibit details modal (supports repeated use and pagination)
// document.addEventListener('click', function (e) {
//   if (e.target.classList.contains('details-btn')) {
//     const idx = parseInt(e.target.dataset.index, 10);
//     const exhibit = exhibitsState.items[idx];
//     const modal = document.getElementById('exhibitModal');
//     const content = document.getElementById('modalContent');
//     if (!exhibit || !content) return;
//     content.innerHTML = `
//       <h2>${exhibit.Name}</h2>
//       <p><strong>City:</strong> ${exhibit.City}</p>
//       <p><strong>State:</strong> ${exhibit.State}</p>
//       <p><strong>Type:</strong> ${exhibit.Type}</p>
//       <p><strong>Established:</strong> ${exhibit.Established || ''}</p>
//     `;
//     if (modal) modal.style.display = 'block';
//   }
// });

// // Confirm Booking
// document.getElementById("confirm-booking")?.addEventListener("click", () => {
//   const date = document.getElementById("booking-date").value;
//   const time = document.getElementById("booking-time").value;
//   const people = document.getElementById("booking-people").value;
//   const type = document.getElementById("museum-type").value;
//   const msg = document.getElementById("booking-msg");

//   if (!date || !time || !people || !type) {
//     msg.textContent = "Please fill in all fields";
//     msg.style.color = "red";
//     return;
//   }

//   // Simulate API call
//   msg.textContent = "Processing booking...";
//   msg.style.color = "blue";
  
//   setTimeout(() => {
//     msg.textContent = "Booking confirmed successfully!";
//     msg.style.color = "green";

//     // Generate mock QR code
//     const qrDiv = document.getElementById("qr-ticket");
//     const qrImg = document.getElementById("qr-img");
//     const downloadLink = document.getElementById("download-link");

//     if (qrImg && downloadLink) {
//       qrImg.src = "../static/images/img1.jpg"; // Using a placeholder image
//       downloadLink.href = "../static/images/img1.jpg";
//       qrDiv.style.display = "block";
//     }
//   }, 2000);
// });

// // Attend Tour
// document.getElementById("attend-btn")?.addEventListener("click", () => {
//   const date = document.getElementById("attend-date").value;
//   const time = document.getElementById("attend-time").value;
//   const msg = document.getElementById("attend-msg");

//   if (!date || !time) {
//     msg.textContent = "Please fill in date and time";
//     msg.style.color = "red";
//     return;
//   }

//   // Simulate API call
//   msg.textContent = "Marking attendance...";
//   msg.style.color = "blue";
  
//   setTimeout(() => {
//     msg.textContent = "Attendance marked successfully!";
//     msg.style.color = "green";
//   }, 1500);
// });

// // Submit Review
// document.getElementById("submit-review")?.addEventListener("click", () => {
//   const rating = document.getElementById("rating").value;
//   const review = document.getElementById("review-text").value;

//   if (!rating || !review) {
//     alert("Please fill in both rating and review");
//     return;
//   }

//   // Simulate API call
//   alert("Thanks for your review!");
// });

// // View History
// function loadHistory() {
//   // Simulate API call with mock data
//   setTimeout(() => {
//     const mockData = [
//       {
//         Museum: 'National Museum',
//         Date: '2025-01-15',
//         Time: '10:00',
//         Attended: 'No',
//         Rating: '4',
//         TicketID: 'ABC123'
//       },
//       {
//         Museum: 'Salar Jung Museum',
//         Date: '2024-12-20',
//         Time: '14:00',
//         Attended: 'Yes',
//         Rating: '5',
//         TicketID: 'DEF456'
//       }
//     ];
    
//     const container = document.getElementById("historyTableBody");
//     if (!Array.isArray(mockData) || mockData.length === 0) {
//       container.innerHTML = "<tr><td colspan='6'>No bookings found.</td></tr>";
//       console.log(container)
//       return;
//     }
    
//     // Sort by date (newest first)
//     mockData.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    
//     let html = "";
//     mockData.forEach(booking => {
//       // Determine status based on date and flags
//       const today = new Date();
//       const bookingDate = new Date(booking.Date);
//       let status = "Upcoming";
//       if (booking.Attended === "Cancelled") {
//         status = "Cancelled";
//       } else if (bookingDate < today) {
//         status = booking.Attended === "Yes" ? "Completed" : "Missed";
//       }
      
//       // Format rating display
//       let ratingDisplay = booking.Rating || "-";
//       if (booking.Rating) {
//         ratingDisplay = "★".repeat(booking.Rating) + "☆".repeat(5 - booking.Rating);
//       }
      
//       // Action buttons: allow review any time for unrated (except if cancelled); allow cancel for upcoming
//       let actionParts = [];
//       if (status === "Upcoming") {
//         actionParts.push(`<button class="cancel-btn" data-ticket="${booking.TicketID}">Cancel</button>`);
//       }
//       if (!booking.Rating && status !== "Cancelled") {
//         actionParts.push(`<button class="review-btn" onclick="openReviewModal('${booking.TicketID}', '${booking.Museum}')">Review</button>`);
//       }
//       let actions = actionParts.join(' ');
//       if (booking.Rating) {
//         actions = `<span class="reviewed">Reviewed</span>`;
//       }
      
//       html += `
//         <tr data-status="${status.toLowerCase()}">
//           <td>${booking.Museum}</td>
//           <td>${booking.Date}</td>
//           <td>${booking.Time}</td>
//           <td><span class="status ${status.toLowerCase()}">${status}</span></td>
//           <td>${ratingDisplay}</td>
//           <td>${actions}</td>
//         </tr>
//       `;
//     });
//     container.innerHTML = html;
//   }, 500);

//   console.log("History loaded successfully");
// }

// // Filter history
// function filterHistory(filterType) {
//   const rows = document.querySelectorAll("#historyTableBody tr");
//   rows.forEach(row => {
//     const status = row.getAttribute('data-status');
//     if (filterType === "all" || status === filterType) {
//       row.style.display = "";
//     } else {
//       row.style.display = "none";
//     }
//   });
// }

// // Add event listeners for filter buttons
// document.addEventListener('DOMContentLoaded', () => {
//   const filterButtons = document.querySelectorAll('.filter-btn');
//   filterButtons.forEach(button => {
//     button.addEventListener('click', () => {
//       // Remove active class from all buttons
//       filterButtons.forEach(btn => btn.classList.remove('active'));
//       // Add active class to clicked button
//       button.classList.add('active');
//       // Filter history
//       const filterType = button.getAttribute('data-filter');
//       filterHistory(filterType);
//     });
//   });
// });

// // Open review modal
// function openReviewModal(ticketId, museumName) {
//   // Create review modal if it doesn't exist
//   let modal = document.getElementById('reviewModal');
//   if (!modal) {
//     modal = document.createElement('div');
//     modal.id = 'reviewModal';
//     modal.className = 'review-modal';
//     modal.innerHTML = `
//       <div class="review-modal-content">
//         <span class="close-review">&times;</span>
//         <h2>Review Your Visit to ${museumName}</h2>
//         <form id="reviewForm">
//           <input type="hidden" id="ticketId" value="${ticketId}">
//           <div class="rating-input">
//             <label>Rating:</label>
//             <div class="stars">
//               <span class="star" data-rating="1">★</span>
//               <span class="star" data-rating="2">★</span>
//               <span class="star" data-rating="3">★</span>
//               <span class="star" data-rating="4">★</span>
//               <span class="star" data-rating="5">★</span>
//             </div>
//             <input type="hidden" id="rating" name="rating" required>
//           </div>
//           <div class="review-input">
//             <label for="reviewText">Your Review:</label>
//             <textarea id="reviewText" name="review" rows="4" placeholder="Share your experience..."></textarea>
//           </div>
//           <button type="submit" class="submit-review-btn">Submit Review</button>
//         </form>
//       </div>
//     `;
//     document.body.appendChild(modal);
    
//     // Add event listeners
//     modal.querySelector('.close-review').addEventListener('click', () => {
//       modal.style.display = 'none';
//     });
    
//     modal.addEventListener('click', (e) => {
//       if (e.target === modal) {
//         modal.style.display = 'none';
//       }
//     });
    
//     // Star rating functionality
//     const stars = modal.querySelectorAll('.star');
//     stars.forEach(star => {
//       star.addEventListener('click', () => {
//         const rating = star.getAttribute('data-rating');
//         document.getElementById('rating').value = rating;
//         // Update star display
//         stars.forEach((s, index) => {
//           s.classList.toggle('selected', index < rating);
//         });
//       });
//     });
    
//     // Form submission
//     modal.querySelector('#reviewForm').addEventListener('submit', submitReview);
//   }
  
//   // Reset form and show modal
//   document.getElementById('reviewForm').reset();
//   document.getElementById('rating').value = '';
//   modal.querySelectorAll('.star').forEach(star => {
//     star.classList.remove('selected');
//   });
//   modal.style.display = 'block';
// }

// // Submit review
// function submitReview(e) {
//   e.preventDefault();
  
//   const ticketId = document.getElementById('ticketId').value;
//   const rating = document.getElementById('rating').value;
//   const review = document.getElementById('reviewText').value;
  
//   if (!rating) {
//     alert('Please select a rating');
//     return;
//   }
  
//   // Simulate API call
//   alert('Review submitted successfully!');
//   document.getElementById('reviewModal').style.display = 'none';
//   // Reload history to show updated review
//   loadHistory();
//   // Reload ratings section
//   loadMyRatings();
// }

// // Cancel booking
// function cancelBooking(ticketId) {
//   if (!ticketId) return;
//   if (!confirm('Are you sure you want to cancel this booking?')) return;
  
//   // Simulate API call
//   setTimeout(() => {
//     alert('Booking cancelled');
//     loadHistory();
//   }, 1000);
// }

// // Load dashboard stats
// function loadDashboardStats() {
//   // Simulate API call with mock data
//   setTimeout(() => {
//     const mockData = [
//       {
//         Museum: 'National Museum',
//         Date: '2025-01-15',
//         Time: '10:00',
//         Attended: 'No',
//         Rating: '4',
//         TicketID: 'ABC123'
//       },
//       {
//         Museum: 'Salar Jung Museum',
//         Date: '2024-12-20',
//         Time: '14:00',
//         Attended: 'Yes',
//         Rating: '5',
//         TicketID: 'DEF456'
//       }
//     ];
    
//     if (!Array.isArray(mockData) || mockData.length === 0) {
//       return;
//     }
    
//     // Calculate stats
//     const totalBookings = mockData.length;
//     const visitedMuseums = new Set(mockData.map(b => b.Museum)).size;
//     const ratings = mockData.filter(b => b.Rating).map(b => parseInt(b.Rating));
//     const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '0.0';
//     const today = new Date();
//     const upcomingTours = mockData.filter(b => {
//       const bookingDate = new Date(b.Date);
//       return bookingDate >= today && b.Attended !== 'Yes';
//     }).length;
    
//     // Update dashboard elements
//     document.getElementById('totalBookings').textContent = totalBookings;
//     document.getElementById('visitedMuseums').textContent = visitedMuseums;
//     document.getElementById('avgRating').textContent = avgRating;
//     document.getElementById('upcomingTours').textContent = upcomingTours;
//   }, 500);
// }

// // Load Popular Exhibits
// function loadPopular() {
//   // Simulate API call with mock data
//   setTimeout(() => {
//     const mockData = [
//       { Rating: '5', Count: '15' },
//       { Rating: '4', Count: '22' },
//       { Rating: '3', Count: '8' }
//     ];
    
//     const container = document.getElementById("popular-container");
//     if (!Array.isArray(mockData) || mockData.length === 0) {
//       container.innerHTML = "<p>No popular data available.</p>";
//       return;
//     }
//     let html = "<table><tr><th>Rating</th><th>Count</th></tr>";
//     mockData.forEach(row => {
//       html += `<tr><td>${row.Rating}</td><td>${row.Count}</td></tr>`;
//     });
//     html += "</table>";
//     container.innerHTML = html;
//   }, 500);
// }

// // Load Personalized Recommendations
// function loadPersonalized() {
//   // Simulate API call with mock data
//   setTimeout(() => {
//     const mockData = [
//       { Name: 'National Museum', City: 'Delhi', Type: 'History' },
//       { Name: 'Indian Museum', City: 'Kolkata', Type: 'History' },
//       { Name: 'Salar Jung Museum', City: 'Hyderabad', Type: 'Art' }
//     ];
    
//     const container = document.getElementById("personalized-container");
//     if (!Array.isArray(mockData) || mockData.length === 0) {
//       container.innerHTML = "<p>No recommendations found.</p>";
//       return;
//     }
//     let html = "<ul class='recommendation-list'>";
//     mockData.forEach(m => {
//       html += `<li><strong>${m.Name}</strong> - ${m.City} (${m.Type})</li>`;
//     });
//     html += "</ul>";
//     container.innerHTML = html;
//   }, 500);
// }

// // Chart initialization is handled in the HTML file
// // No duplicate chart code needed here

// // Enhanced Museum Booking System
// class MuseumBookingSystem {
//   constructor() {
//     this.museums = [];
//     this.filteredMuseums = [];
//     this.selectedMuseum = null;
//     this.init();
//   }

//   async init() {
//     await this.loadMuseums();
//     await this.loadFilters();
//     this.setupEventListeners();
//     this.setMinDate();
//   }

//   async loadMuseums() {
//     // Simulate API call with mock data
//     setTimeout(() => {
//       this.museums = [
//         {
//           Name: 'National Museum',
//           City: 'Delhi',
//           State: 'Delhi',
//           Type: 'History',
//           Established: '1949'
//         },
//         {
//           Name: 'Indian Museum',
//           City: 'Kolkata',
//           State: 'West Bengal',
//           Type: 'History',
//           Established: '1814'
//         },
//         {
//           Name: 'Salar Jung Museum',
//           City: 'Hyderabad',
//           State: 'Telangana',
//           Type: 'Art',
//           Established: '1951'
//         },
//         {
//           Name: 'Chhatrapati Shivaji Maharaj Vastu Sangrahalaya',
//           City: 'Mumbai',
//           State: 'Maharashtra',
//           Type: 'History',
//           Established: '1922'
//         },
//         {
//           Name: 'Government Museum',
//           City: 'Chennai',
//           State: 'Tamil Nadu',
//           Type: 'Science',
//           Established: '1851'
//         },
//         {
//           Name: 'National Gallery of Modern Art',
//           City: 'Delhi',
//           State: 'Delhi',
//           Type: 'Art',
//           Established: '1954'
//         }
//       ];
//       this.filteredMuseums = [...this.museums];
//       console.log(`Loaded ${this.museums.length} museums`);
//     }, 500);
//   }

//   async loadFilters() {
//     // Simulate API call with mock data
//     setTimeout(() => {
//       const filters = {
//         types: ['Art', 'History', 'Science'],
//         cities: ['Delhi', 'Kolkata', 'Hyderabad', 'Mumbai', 'Chennai']
//       };
//       this.populateFilterDropdowns(filters);
//     }, 500);
//   }

//   populateFilterDropdowns(filters) {
//     const typeFilter = document.getElementById('typeFilter');
//     const cityFilter = document.getElementById('cityFilter');
    
//     if (typeFilter && filters.types) {
//       // Clear existing options except the first one
//       typeFilter.innerHTML = '<option value="">All Types</option>';
      
//       // Add dynamic types
//       filters.types.forEach(type => {
//         const option = document.createElement('option');
//         option.value = type;
//         option.textContent = type;
//         typeFilter.appendChild(option);
//       });
//     }
    
//     if (cityFilter && filters.cities) {
//       // Clear existing options except the first one
//       cityFilter.innerHTML = '<option value="">All Cities</option>';
      
//       // Add dynamic cities
//       filters.cities.forEach(city => {
//         const option = document.createElement('option');
//         option.value = city;
//         option.textContent = city;
//         cityFilter.appendChild(option);
//       });
//     }
//   }

//   setupEventListeners() {
//     // Search functionality
//     const searchInput = document.getElementById('museumSearchInput');
//     if (searchInput) {
//       searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
//     }

//     // Filter functionality
//     const typeFilter = document.getElementById('typeFilter');
//     const cityFilter = document.getElementById('cityFilter');
    
//     if (typeFilter) {
//       typeFilter.addEventListener('change', () => this.applyFilters());
//     }
//     if (cityFilter) {
//       cityFilter.addEventListener('change', () => this.applyFilters());
//     }

//     // Reset search
//     const resetBtn = document.getElementById('resetSearch');
//     if (resetBtn) {
//       resetBtn.addEventListener('click', () => this.resetSearch());
//     }

//     // Form submission
//     const bookingForm = document.getElementById('bookingForm');
//     if (bookingForm) {
//       bookingForm.addEventListener('submit', (e) => this.handleBookingSubmit(e));
//     }

//     // Form field changes for summary updates
//     this.setupFormListeners();
//   }

//   setupFormListeners() {
//     const formFields = [
//       'visitDate', 'visitTime', 'numPeople', 'tourType', 
//       'visitorName', 'visitorEmail', 'visitorPhone', 'visitorAge'
//     ];

//     formFields.forEach(fieldId => {
//       const field = document.getElementById(fieldId);
//       if (field) {
//         field.addEventListener('change', () => this.updateSummary());
//         field.addEventListener('input', () => this.updateSummary());
//       }
//     });

//     // Special handling for date changes
//     const visitDate = document.getElementById('visitDate');
//     if (visitDate) {
//       visitDate.addEventListener('change', () => this.updateAvailableTimes());
//     }

//     // Special handling for tour type changes
//     const tourType = document.getElementById('tourType');
//     if (tourType) {
//       tourType.addEventListener('change', () => this.updatePricingInfo());
//     }
//   }

//   handleSearch(query) {
//     const searchTerm = query.toLowerCase().trim();
    
//     if (searchTerm === '') {
//       this.filteredMuseums = [...this.museums];
//     } else {
//       this.filteredMuseums = this.museums.filter(museum =>
//         museum.Name.toLowerCase().includes(searchTerm) ||
//         museum.City.toLowerCase().includes(searchTerm) ||
//         museum.State.toLowerCase().includes(searchTerm) ||
//         museum.Type.toLowerCase().includes(searchTerm)
//       );
//     }

//     this.applyFilters();
//     this.displaySearchResults();
//   }

//   applyFilters() {
//     const typeFilter = document.getElementById('typeFilter')?.value || '';
//     const cityFilter = document.getElementById('cityFilter')?.value || '';
//     const searchTerm = document.getElementById('museumSearchInput')?.value.toLowerCase().trim() || '';

//     let filtered = this.museums;

//     // Apply search filter
//     if (searchTerm) {
//       filtered = filtered.filter(museum =>
//         museum.Name.toLowerCase().includes(searchTerm) ||
//         museum.City.toLowerCase().includes(searchTerm) ||
//         museum.State.toLowerCase().includes(searchTerm) ||
//         museum.Type.toLowerCase().includes(searchTerm)
//       );
//     }

//     // Apply type filter
//     if (typeFilter) {
//       filtered = filtered.filter(museum => museum.Type === typeFilter);
//     }

//     // Apply city filter
//     if (cityFilter) {
//       filtered = filtered.filter(museum => museum.City === cityFilter);
//     }

//     this.filteredMuseums = filtered;
//     this.displaySearchResults();
//   }

//   displaySearchResults() {
//     const resultsContainer = document.getElementById('searchResults');
//     const resultsList = document.getElementById('resultsList');
//     const resultsCount = document.getElementById('resultsCount');

//     if (!resultsContainer || !resultsList || !resultsCount) return;

//     if (this.filteredMuseums.length === 0) {
//       resultsContainer.style.display = 'none';
//       return;
//     }

//     resultsCount.textContent = `${this.filteredMuseums.length} result${this.filteredMuseums.length !== 1 ? 's' : ''}`;
    
//     resultsList.innerHTML = this.filteredMuseums.map(museum => `
//       <div class="museum-result-item" data-museum-id="${museum.Name}" 
//            onmouseenter="bookingSystem.showMuseumTooltip(event, ${JSON.stringify(museum).replace(/"/g, '&quot;')})"
//            onmouseleave="bookingSystem.hideMuseumTooltip()">
//         <div class="museum-info">
//           <div class="museum-name">${museum.Name}</div>
//           <div class="museum-details">
//             <span><i class="fas fa-map-marker-alt"></i> ${museum.City}, ${museum.State}</span>
//             <span><i class="fas fa-tag"></i> ${museum.Type}</span>
//             ${museum.Established ? `<span><i class="fas fa-calendar"></i> Est. ${museum.Established}</span>` : ''}
//           </div>
//         </div>
//         <button class="select-btn" onclick="bookingSystem.selectMuseum('${museum.Name}')">
//           <i class="fas fa-check"></i> Select
//         </button>
//       </div>
//     `).join('');

//     resultsContainer.style.display = 'block';
//   }

//   selectMuseum(museumName) {
//     this.selectedMuseum = this.museums.find(m => m.Name === museumName);
    
//     if (this.selectedMuseum) {
//       // Update museum select dropdown
//       const museumSelect = document.getElementById('museumSelect');
//       if (museumSelect) {
//         // Clear existing options
//         museumSelect.innerHTML = '<option value="">Choose a museum from search results...</option>';
        
//         // Add selected museum
//         const option = document.createElement('option');
//         option.value = this.selectedMuseum.Name;
//         option.textContent = `${this.selectedMuseum.Name} - ${this.selectedMuseum.City}`;
//         option.selected = true;
//         museumSelect.appendChild(option);
//       }

//       // Update summary
//       this.updateSummary();
      
//       // Hide search results
//       const searchResults = document.getElementById('searchResults');
//       if (searchResults) {
//         searchResults.style.display = 'none';
//       }

//       // Show success message
//       this.showMessage(`Selected: ${this.selectedMuseum.Name}`, 'success');
//     }
//   }

//   resetSearch() {
//     document.getElementById('museumSearchInput').value = '';
//     document.getElementById('typeFilter').value = '';
//     document.getElementById('cityFilter').value = '';
    
//     this.filteredMuseums = [...this.museums];
//     this.displaySearchResults();
    
//     // Clear selected museum
//     this.selectedMuseum = null;
//     const museumSelect = document.getElementById('museumSelect');
//     if (museumSelect) {
//       museumSelect.innerHTML = '<option value="">Choose a museum from search results...</option>';
//     }
    
//     this.updateSummary();
//   }

//   setMinDate() {
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     const dateInput = document.getElementById('visitDate');
//     if (dateInput) {
//       dateInput.min = tomorrow.toISOString().split('T')[0];
//     }
//   }

//   updateSummary() {
//     if (!this.selectedMuseum) {
//       this.clearSummary();
//       return;
//     }

//     const summaryMuseum = document.getElementById('summaryMuseum');
//     const summaryLocation = document.getElementById('summaryLocation');
//     const summaryDate = document.getElementById('summaryDate');
//     const summaryTime = document.getElementById('summaryTime');
//     const summaryPeople = document.getElementById('summaryPeople');
//     const summaryTourType = document.getElementById('summaryTourType');
//     const summaryVisitor = document.getElementById('summaryVisitor');
//     const summaryContact = document.getElementById('summaryContact');
//     const summaryTotal = document.getElementById('summaryTotal');

//     if (summaryMuseum) summaryMuseum.textContent = this.selectedMuseum.Name;
//     if (summaryLocation) summaryLocation.textContent = `${this.selectedMuseum.City}, ${this.selectedMuseum.State}`;
    
//     // Update other fields based on form values
//     const visitDate = document.getElementById('visitDate')?.value;
//     const visitTime = document.getElementById('visitTime')?.value;
//     const numPeople = document.getElementById('numPeople')?.value;
//     const tourType = document.getElementById('tourType')?.value;
//     const visitorName = document.getElementById('visitorName')?.value;
//     const visitorEmail = document.getElementById('visitorEmail')?.value;
//     const visitorPhone = document.getElementById('visitorPhone')?.value;

//     if (summaryDate) summaryDate.textContent = visitDate || '-';
//     if (summaryTime) summaryTime.textContent = visitTime || '-';
//     if (summaryPeople) summaryPeople.textContent = numPeople || '-';
//     if (summaryTourType) summaryTourType.textContent = tourType || '-';
//     if (summaryVisitor) summaryVisitor.textContent = visitorName || '-';
//     if (summaryContact) summaryContact.textContent = visitorEmail || visitorPhone || '-';

//     // Calculate total
//     if (summaryTotal && numPeople && tourType) {
//       const total = this.calculateTotal(numPeople, tourType);
//       summaryTotal.textContent = `₹${total.toLocaleString()}`;
//     }
//   }

//   calculateTotal(people, tourType) {
//     const prices = {
//       'guided': 500,
//       'self-guided': 200,
//       'virtual': 100,
//       'group': 300,
//       'educational': 400
//     };

//     const basePrice = prices[tourType] || 200;
//     let total = basePrice * parseInt(people);

//     // Apply group discount
//     if (tourType === 'group' && people >= 5) {
//       total = total * 0.9; // 10% discount
//     }

//     return total;
//   }

//   clearSummary() {
//     const summaryFields = [
//       'summaryMuseum', 'summaryLocation', 'summaryDate', 'summaryTime',
//       'summaryPeople', 'summaryTourType', 'summaryVisitor', 'summaryContact', 'summaryTotal'
//     ];

//     summaryFields.forEach(fieldId => {
//       const field = document.getElementById(fieldId);
//       if (field) field.textContent = '-';
//     });
//   }

//   async handleBookingSubmit(e) {
//     e.preventDefault();

//     if (!this.selectedMuseum) {
//       this.showMessage('Please select a museum first', 'error');
//       return;
//     }

//     // Validate form
//     if (!this.validateForm()) {
//       return;
//     }

//     // Prepare booking data
//     const bookingData = this.prepareBookingData();
    
//     // Simulate API call
//     this.showMessage('Processing your booking...', 'info');
    
//     setTimeout(() => {
//       this.showMessage('Booking confirmed successfully!', 'success');
//       // Reset form
//       document.getElementById('bookingForm').reset();
//       this.selectedMuseum = null;
//       this.clearSummary();
      
//       // Clear museum selection
//       const museumSelect = document.getElementById('museumSelect');
//       if (museumSelect) {
//         museumSelect.innerHTML = '<option value="">Choose a museum from search results...</option>';
//       }
//     }, 2000);
//   }

//   validateForm() {
//     const requiredFields = [
//       'visitDate', 'visitTime', 'numPeople', 'tourType',
//       'visitorName', 'visitorEmail', 'visitorPhone', 'visitorAge'
//     ];

//     for (const fieldId of requiredFields) {
//       const field = document.getElementById(fieldId);
//       if (!field || !field.value) {
//         this.showMessage(`Please fill in ${fieldId.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
//         return false;
//       }
//     }

//     // Email validation
//     const email = document.getElementById('visitorEmail').value;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       this.showMessage('Please enter a valid email address', 'error');
//       return false;
//     }

//     // Phone validation (simple)
//     const phone = document.getElementById('visitorPhone').value;
//     if (phone.length < 10) {
//       this.showMessage('Please enter a valid phone number', 'error');
//       return false;
//     }

//     return true;
//   }

//   prepareBookingData() {
//     return {
//       museum: this.selectedMuseum.Name,
//       date: document.getElementById('visitDate').value,
//       time: document.getElementById('visitTime').value,
//       people: document.getElementById('numPeople').value,
//       tourType: document.getElementById('tourType').value,
//       visitorName: document.getElementById('visitorName').value,
//       visitorEmail: document.getElementById('visitorEmail').value,
//       visitorPhone: document.getElementById('visitorPhone').value,
//       visitorAge: document.getElementById('visitorAge').value,
//       specialRequests: document.getElementById('specialRequests').value,
//       emergencyContact: document.getElementById('emergencyContact').value
//     };
//   }

//   showMessage(message, type) {
//     const msgElement = document.getElementById('bookingMsg') || 
//                       document.getElementById('searchMsg') ||
//                       document.createElement('div');
    
//     msgElement.textContent = message;
//     msgElement.className = `message ${type}`;
    
//     // If we created a new element, add it to the DOM
//     if (!msgElement.id) {
//       msgElement.id = 'bookingMsg';
//       const form = document.getElementById('bookingForm');
//       if (form) {
//         form.parentNode.insertBefore(msgElement, form.nextSibling);
//       }
//     }
//   }

//   showMuseumTooltip(event, museum) {
//     // Implementation for showing museum tooltip
//     console.log('Showing tooltip for:', museum.Name);
//   }

//   hideMuseumTooltip() {
//     // Implementation for hiding museum tooltip
//     console.log('Hiding tooltip');
//   }

//   updateAvailableTimes() {
//     // Implementation for updating available times based on date
//     console.log('Updating available times');
//   }

//   updatePricingInfo() {
//     // Implementation for updating pricing information
//     console.log('Updating pricing info');
//   }
// }

// // Initialize booking system when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//   window.bookingSystem = new MuseumBookingSystem();
  
//   // Load dashboard stats
//   loadDashboardStats();
  
//   // Load history
//   loadHistory();
  
//   // Load my ratings
//   loadMyRatings();
// });