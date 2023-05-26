# JobHub
A Job Board Web API that allows users to browse and apply to job listings.

## API Documentation

### Authentication Endpoint (/api/auth)

#### Sign Up (User Registration)
Registers a new user.

- Endpoint: `POST /api/auth/signup`
- Authentication Required: No
- Request Body: JSON object representing the user details
  - firstName (string): User's first name
  - lastName (string): User's last name
  - email (string): User's email address
  - password (string): User's password
  - role ('admin' | 'employer' | 'user'): User's role 
  - admin_key (string): Admin's Key
- Success Response:
  - Status Code: 201 Created
  - Response Body: `{ message: "Registration sucessful" }`
- Error Response:
  - Status Code: 400 Bad Request
  - Response Body: JSON object with an error message
    - `{ error: "Please enter all the details" }`
    - `{ error: "Please enter a valid email" }`
    - `{ error: "Password must be at least 8 characters long" }`
    - `{ error: "Please enter a valid role" }`
    - `{ error: "Invalid Admin key" }`
  - Status Code: 409 Conflict
  - Response Body: `{ error: "User already exist with the given email" }`
  - Status Code: 500 Internal Server Error
  - Response Body: `{ error: "Encountered an error" }`

#### Sign In (User Login)
Authenticates a user and signs them into the application.

- Endpoint: `POST /api/auth/signin`
- Authentication Required: No
- Request Body: JSON object representing the user credentials
  - email (string): User's email address
  - password (string): User's password
- Success Response:
  - Status Code: 200 OK
  - Response Body: `{ message: "Signin successful" }`
- Error Response:
  - Status Code: 401 Unauthorized
  - Response Body: ` {error: "Incorrect email or password"}`
  - Status Code: 500 Internal Server Error
  - Response Body: JSON object with an error message
    - `{ error: "An error occurred during authentication" }`
    - `{ error: "An error occurred while logging in" }`

#### Sign Out (User Logout)
Signs the user out of the application.
- Endpoint: `POST /api/auth/signout`
- Authentication Required: Yes
- Request Headers:
  - Cookie: Session cookie containing the user's authentication session
- Success Response:
  - Status Code: 200 OK
  - Response Body: `{ message: "Signout successful" }`
- Error Response:
  - Status Code: 401 Unauthorized
Response Body: `{ error: "Authentication error" }`

### Jobs Endpoint (/api/jobs)

#### Add Job
- Endpoint: `POST /api/jobs`
- Authentication Required: Yes
- Authorization: ('admin' | 'employer') role
- Request Body: JSON object representing the job details
  - title (string): Job's title
  - description (string): Job's description
  - location (string): Job's location
  - salary (string): Job's salary
  - createdBy (string): Job's creator user id
  - status ('draft' [default] | 'published'): Job's status
- Success Response:
  - Status Code: 201 Created
  - Response Body: JSON object representing the created job
- Error Response:
- Status Code: 400 Bad Request
- Response Body: { error: 'Invalid job' }
- Status Code: 500 Internal Server Error
- Response Body: { error: 'Encountered an error' }