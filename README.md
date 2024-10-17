# Wedding RSVP Frontend

This is the frontend for a wedding RSVP system built with React, TypeScript, and Vite.

## Project Structure

The project is organized into the following main directories:

- `src/components`: React components
- `src/contexts`: React context providers
- `src/services`: API service functions
- `src/styles`: CSS and style-related files
- `src/types`: TypeScript type definitions

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see below)
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env` file in the project root with the following variables:

```
VITE_API_URL=http://localhost:8000/api
VITE_APP_URL=http://localhost:5173
```

## Available Scripts

- `npm run dev`: Run the development server
- `npm run build`: Build the project for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview the production build locally

## Key Features and Components

### Password Entry

The `PasswordEntry` component (`src/components/PasswordEntry.tsx`) serves as the initial gateway to the application:

- Users must enter a correct password to access the site.
- Implemented using a form with a single input field for the password.
- On submission, it calls the `checkPassword` function from the API service.
- If the password is correct, a JWT token is stored in localStorage, and the user is redirected to the registration page.
- Error handling for incorrect passwords or API issues.

### RSVP Component

The `RSVP` component (`src/components/RSVP.tsx`) handles the RSVP submission process:

- Utilizes a form to collect RSVP information from guests.
- Includes fields for selecting which wedding(s) to attend, attendance confirmation, and additional notes.
- Uses the `SearchableGuestDropdown` component for guest selection.
- Implements form validation and error handling.
- On submission, calls the `submitRSVP` function from the API service.
- Provides feedback to the user on successful submission or errors.

### Song Selection Component

The `SongSelection` component (`src/components/SongSelection.tsx`) allows guests to request songs:

- Features a form for submitting song requests.
- Includes fields for song title and artist.
- Also uses the `SearchableGuestDropdown` for guest selection.
- Implements form validation and error handling.
- On submission, calls the `submitSongRequest` function from the API service.
- Provides user feedback on successful submission or errors.

### Memories Component

The `Memories` component (`src/components/Memories.tsx`) enables guests to share and view memories:

- Combines memory submission and display functionalities.
- Features a form for submitting new memories, including a text area for the memory content.
- Utilizes the `SearchableGuestDropdown` for guest selection when submitting memories.
- Displays existing memories using the `MemoryConveyorBelt` component.
- Implements form validation and error handling.
- On submission, calls the `submitMemory` function from the API service.
- Fetches all memories using the `fetchAllMemories` function on component mount.

### Memory Carousel (Conveyor Belt)

The `MemoryConveyorBelt` component (`src/components/MemoryConveyorBelt.tsx`) creates an engaging display of shared memories:

- Implements a carousel-like interface for displaying memories.
- Uses Framer Motion for smooth animations and transitions.
- Automatically cycles through memories at a set interval (5 seconds).
- Allows manual navigation with "Previous" and "Next" buttons.
- Displays the guest's name, memory text, and the date the memory was shared.
- Responsive design that works well on various screen sizes.

## Shared Components

### SearchableGuestDropdown

The `SearchableGuestDropdown` component (`src/components/SearchableGuestDropdown.tsx`) is a reusable component used in multiple forms:

- Provides a searchable dropdown for selecting guests.
- Implements real-time filtering of guests based on user input.
- Uses a portal for rendering the dropdown, ensuring proper stacking context.
- Handles keyboard navigation and accessibility considerations.

### AnimatedForm

The `AnimatedForm` component (`src/components/AnimatedForm.tsx`) wraps form content with animations:

- Utilizes Framer Motion for enter/exit animations of form elements.
- Enhances user experience with smooth transitions when forms are rendered.

## Styling

Styling is done using Tailwind CSS with custom utility classes defined in `src/styles/custom.css`. The `sharedStyles` object in `src/styles/shared.ts` provides consistent styling across components.

## API Integration

API calls are managed through the `api.ts` file in the `src/services` directory. Axios is used for HTTP requests, with interceptors for handling authentication and errors.

## Authentication

JWT tokens are used for authentication. The token is stored in localStorage and included in the header of API requests. The `ProtectedRoute` component in `App.tsx` ensures that only authenticated users can access certain routes.

## Deployment

The project can be deployed to any static site hosting service. Make sure to set the correct environment variables for the production build.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Submit a pull request

## License

This project is licensed under the MIT License.