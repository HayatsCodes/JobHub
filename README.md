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
  - Response Body: JSON object representing the created user (including the User ID)
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
Creates a new job.

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
- Response Body: `{ error: 'Invalid job' }`

#### Get Jobs
Retrieves a list of published jobs.

- Endpoint: `GET /api/jobs`
- Authentication Required: Yes
- Authorization: ('admin' | 'user') role
- Success Response:
  - Status Code: 200 OK
  - Response Body: JSON array containing the list of published jobs
- Error Response:
  - Status Code: 500 Internal Server Error
  - Response Body: `{ error: 'Encountered an error' }`

#### Get Job
Retrieves a single published job by ID.

- Endpoint: `GET /api/jobs/:id`
- Authentication Required: Yes
- Authorization: ('admin' | 'user') role
- Success Response:
  - Status Code: 200 OK
  - Response Body: JSON object representing the published job
- Error Response:
  - Status Code: 404 Not Found
  - Response Body: `{ error: 'Job not found' }`
  - Status Code: 500 Internal Server Error
  - Response Body: `{ error: 'Encountered an error' }`

#### Get Employer Jobs
Retrieves a list of jobs created by the authenticated employer or admin by Employer ID.

- Endpoint: `GET /api/jobs/employer` or `GET /api/jobs/employer?employerId=id`
- Authentication Required: Yes
- Authorization: ('admin' | 'employer') role
- Success Response:
  - Status Code: 200 OK
  - Response Body: JSON array containing the list of jobs created by the authenticated employer
- Error Response:
  - Status Code: 500 Internal Server Error
  - Response Body: `{ error: 'Encountered an error' }`

#### Get Employer Job
Retrieves a single job created by the authenticated employer by ID.

- Endpoint: `GET /api/jobs/employer/:id`
- Authentication Required: Yes
- Authorization: 'employer' role
- Success Response:
  - Status Code: 200 OK
  - Response Body: JSON object representing the job created by the authenticated employer
- Error Response:
  - Status Code: 404 Not Found
  - Response Body: `{ error: 'Job not found' }`
  - Status Code: 500 Internal Server Error
  - Response Body: `{ error: 'Encountered an error' }`

#### Update Job
Updates an existing job by ID.

- Endpoint: `PATCH /api/jobs/employer/:id`
- Authentication Required: Yes
- Authorization: ('admin' | 'employer') role
- Request Body: JSON object representing the updated job details
- Success Response:
  - Status Code: 200 OK
  - Response Body: JSON object representing the updated job
- Error Response:
  - Status Code: 404 Not Found
  - Response Body: `{ error: 'Job not found' }`
- Status Code: 500 Internal Server Error
- Response Body: `{ error: 'Encountered an error' }`

#### Delete Job
Deletes an existing job by ID.

- Endpoint: `DELETE /api/jobs/employer/:id`
- Authentication Required: Yes
- Authorization: ('admin' | 'employer') role
- Success Response:
  - Status Code: 200 OK
  - Response Body: `{ message: 'Job deleted successfully' }`
- Error Response:
  - Status Code: 404 Not Found
  - Response Body: `{ error: 'Job not found' }`
  - Status Code: 500 Internal Server Error
  - Response Body: `{ error: 'Encountered an error' }`

### Applications Endpoint (/api/applications)

#### Add Application
Creates a new job application.

- Endpoint: `POST /api/applications`
- Authentication Required: Yes
- Authorization: 'user' role
- Request Body: JSON object representing the job details
  - jobId (ID: string): ID of the job to which the application is being made
  - status ('pending' [default] | 'accepted' | 'rejected'): The status of the job application
  - resume (string): The link to the user's resume/cv
  - coverLetter (string [optional]): The link to the user's cover letter
  - links ([string]): An array of relevant social links of the user
- Success Response:
  - Status Code: 201 Created
  - Response Body: JSON object representing the created application
- Error Response:
  - Status Code: 400 Bad Request
  - Response Body: `{ error: 'Cannot create application' }`
  - Status Code: 500 Internal Server Error
  - Response Body: `{ error: 'Internal server error' }`

#### Get Applications
Retrieves a list of applications.

- Endpoint: `GET /api/applications`
- Authentication Required: Yes
- Authorization: ('admin' | 'employer') role
  - admin: Retrieves all applications
  - employer: Retrieves job applications posted by the employer
- Success Response:
- Status Code: 200 OK
  - Response Body: JSON array containing the list of applications
- Error Response:
  - Status Code: 500 Internal Server Error
  - Response Body: { error: 'Encountered an error' }

#### Get Application
Retrieves a single application by ID.

- Endpoint: `GET /api/applications/:id`
- Authentication Required: Yes
- Authorization: ('admin' | 'employer') role
  - admin: Retrieves any application by ID
  - employer: Retrieves application posted by the employer by ID
- Success Response:
  - Status Code: 200 OK
  - Response Body: JSON object representing the application
- Error Response:
  - Status Code: 404 Not Found
  - Response Body: { error: 'Application not found' }
  - Status Code: 500 Internal Server Error
  - Response Body: { error: 'Encountered an error' }