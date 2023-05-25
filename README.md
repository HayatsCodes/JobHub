# JobHub
A Job Board Web Application that allows users to browse and apply to job listings.

## API Endpoints Documentation

### Authentication Endpoints (/api/auth)
#### Sign Up (User Registration)
Registers a new user.

- Endpoint: POST /api/auth/signup
- Authentication Required: No
- Request Body: JSON object representing the user details
- Success Response:
- Status Code: 201 Created
- Response Body: JSON object representing the registered user
- Error Response:
  - Status Code: 400 Bad Request
- Response Body: `{ error: 'Invalid user' }`
- Status Code: 500 Internal Server Error
- Response Body: `{ error: 'Encountered an error' }`

#### Sign In (User Login)
Authenticates a user and signs them into the application.

- Endpoint: POST /api/auth/signin
- Authentication Required: No
- Request Body: JSON object representing the user credentials
- email (string): User's email address
- password (string): User's password
- Success Response:
  - Status Code: 200 OK
- Response Body: JSON object with a success message
- message (string): "Signin successful"
- Error Response:
  - Status Code: 401 Unauthorized
- Response Body: JSON object with an error message
- error (string): Error message indicating the reason for authentication failure
- Status Code: 500 Internal Server Error
- Response Body: JSON object with an error message
- error (string): "An error occurred during authentication" or "An error occurred while logging in"
