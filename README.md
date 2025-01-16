# Project Estimator Tool

## Overview
The Project Estimator Tool is a comprehensive application that allows users to upload project descriptions or provide textual details, define project parameters (name, time, and budget), and receive AI-generated modules and submodules for their project with estimated completion hours. The tool includes an AI assistant for customization and stores all project details in a Firebase database. The backend includes a Node.js API for PDF upload and AI model integration.

---

## Features

1. **PDF Upload and Text Description**:
   - Users can upload a project description in PDF format or write the description directly in the application.

2. **Project Details Input**:
   - Fields for entering the project name, estimated time, and budget.

3. **AI-Generated Modules and Submodules**:
   - AI generates project modules and submodules based on the provided description and predefined training data.
   - Estimated hours for each module and submodule are calculated based on project time and past data.

4. **AI Assistant for Customization**:
   - Users can add new submodules or edit existing ones by providing prompts to the AI assistant.
   - AI adjusts the estimated hours dynamically.

5. **Database Storage**:
   - On clicking "Create Project," all project data is stored in Firebase.
   - Training the AI model to reuse historical data for similar submodules to enhance estimation accuracy.

6. **Backend API**:
   - Node.js API handles PDF uploads and integrates AI for module generation.

---

## Technologies Used

### Frontend:
- **Framework**: Next.js
- **Styling**: Tailwind CSS (or another CSS framework as per preference)
- **State Management**: Context API/Redux (optional based on complexity)

### Backend:
- **Framework**: Node.js with Express.js
- **Database**: Firebase Firestore
- **AI Model**: OpenAI API (or any other suitable AI model)

### Other Tools:
- **PDF Parsing**: Libraries like pdf-parse or pdf-lib for extracting text from uploaded PDFs.
- **Training Data**: Firebase Firestore for historical submodule data.

---

## Project Structure

### Frontend:
```
/app
|-- api
|   |-- pdfresponse
|   |   |-- route.js         # Handles project estimation and PDF processing
|   |-- chat-suggestions
|   |   |-- route.js         # Handles chat suggestions for project modules
|-- add-project
|   |-- page.tsx             # Main input form for adding a project
|-- edit
|   |-- [id]
|   |   |-- page.tsx         # Edit project details
|-- details
|   |-- [id]
|   |   |-- page.tsx         # View project details and generated modules
|-- generate
|   |-- [id]
|   |   |-- page.tsx         # Generate project estimates based on input
|-- page.tsx                 # Main landing page
```

### Backend:
```
/firebase.ts                  # Firebase configuration and Firestore functions
```

---

## API Endpoints

### Backend:

1. **Upload PDF**:
   - **Endpoint**: `POST /api/pdfresponse`
   - **Description**: Accepts a PDF file and processes its content to generate project estimates.
   - **Request Body**: Contains project details and the uploaded PDF.
   - **Response**: JSON object with the generated project estimate.

2. **Chat Suggestions**:
   - **Endpoint**: `POST /api/chat-suggestions`
   - **Description**: Provides suggestions for project modules based on user input.
   - **Request Body**: Contains project context and current suggestions.
   - **Response**: JSON object with updated suggestions and explanations.

3. **Save Project Estimate**:
   - **Endpoint**: `POST /api/save-project`
   - **Description**: Saves the project estimate to Firebase.
   - **Request Body**: Contains the project estimate data.
   - **Response**: Confirmation of project creation.

---

## Firebase Configuration
1. Create a Firebase project.
2. Enable Firestore Database.
3. Add the Firebase credentials to the `.env.local` file in the frontend:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

---

## Installation

### Frontend:
1. Navigate to the frontend directory:
   ```bash
   cd project-estimator-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend:
1. Navigate to the backend directory:
   ```bash
   cd project-estimator-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   nodemon index.js
   ```

---

## AI Training
- Collect historical data on submodules and their estimated hours.
- Store this data in Firebase for reference during future estimations.
- Use the AI model to cross-reference and dynamically generate module structures.

---

## Future Enhancements
- Add user authentication for project security.
- Provide detailed reports with downloadable summaries.
- Enable collaboration by allowing multiple users to edit the same project.

---

## Contributing
- Fork the repository.
- Create a feature branch.
- Commit your changes and open a pull request.
