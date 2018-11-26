const ERRORS = {};

// User errors
ERRORS.NAME_MIN = 3;
ERRORS.NAME_MAX = 30;
ERRORS.NAME_LENGTH = `Name must be between ${ERRORS.NAME_MIN} and ${ERRORS.NAME_MAX} characters`;
ERRORS.NAME_REQUIRED = `Name field is required`;
ERRORS.EMAIL_REQUIRED = `Email field is required`;
ERRORS.EMAIL_FORMAT = `Email is invalid`;
ERRORS.EMAIL_DUPLICATE = `Email already exists.`;
ERRORS.EMAIL_NOTFOUND = `User not found`;
ERRORS.PASSWORD_MIN = 6;
ERRORS.PASSWORD_MAX = 30;
ERRORS.PASSWORD_LENGTH = `Password must be at least ${ERRORS.PASSWORD_MIN}`;
ERRORS.PASSWORD_REQUIRED = `Password field is required`;
ERRORS.PASSWORD_INCORRECT = `Password incorrect.`;
ERRORS.PASSWORD2_REQUIRED = `Confirm password field is required`;
ERRORS.PASSWORD2_MATCH = `Passwords must match`;

// Profile errors
ERRORS.USER_NOTFOUND = `User not found`;
ERRORS.USER_NOAUTH = 'User not authorized';
ERRORS.PROFILE_NOTFOUND = `There is no profile for this user`;
ERRORS.PROFILES_NOTFOUND = `There are no profiles`;
ERRORS.HANDLE_MIN = 4;
ERRORS.HANDLE_MAX = 40;
ERRORS.HANDLE_REQUIRED = `Handle field is required`;
ERRORS.HANDLE_DUPLICATE = `This handle already exists`;
ERRORS.HANDLE_LENGTH = `Handle must be between ${ERRORS.HANDLE_MIN} and ${ERRORS.HANDLE_MAX}`;
ERRORS.STATUS_REQUIRED = `Status field is required`;
ERRORS.SKILLS_REQUIRED = `Skills field is required`;
ERRORS.URL_FORMAT = `Not a valid URL`;
ERRORS.FACEBOOK_FORMAT = ERRORS.URL_FORMAT;
ERRORS.INSTAGRAM_FORMAT = ERRORS.URL_FORMAT;
ERRORS.LINKEDIN_FORMAT = ERRORS.URL_FORMAT;
ERRORS.WEBSITE_FORMAT = ERRORS.URL_FORMAT;
ERRORS.YOUTUBE_FORMAT = ERRORS.URL_FORMAT;

// USER EXPERIENCE
ERRORS.EXP_TITLE_REQUIRED = `Job title field is required`;
ERRORS.EXP_COMPANY_REQUIRED = `Company field is required`;
ERRORS.FROM_REQUIRED = `From date field is required`;

// USER EDUCATION
ERRORS.EDU_SCHOOL_REQUIRED = `School name field is required`;
ERRORS.EDU_DEGREE_REQUIRED = `Degree field is required`;
ERRORS.EDU_STUDY_REQUIRED = `Field of study field is required`;

// POSTS
ERRORS.POST_REQUIRED = `Text field is required`;
ERRORS.POST_MIN = 10;
ERRORS.POST_MAX = 300;
ERRORS.POST_LENGTH = `Post must be between ${ERRORS.POST_MIN} and ${ERRORS.POST_MAX} characters`;
ERRORS.POST_NOTFOUND = `No post found with that ID`;
ERRORS.POSTS_NOTFOUND = `No posts found`;
ERRORS.ALREADY_LIKED = `User already liked this post`;
ERRORS.NOT_LIKED = `User has not liked this post yet`;

module.exports = ERRORS;