// Mapper for environment variables
require("dotenv").config();

export const environment = process.env.NODE_ENV;
export const db_host = process.env.DB_HOST
export const db_name = process.env.DB_NAME
export const port = process.env.PORT
export const corsUrl = process.env.CROS_URL
export const logDirectory = process.env.LOG_DIR
export const jwt_secret = process.env.JWT_SECRET
export const token_expires_in = process.env.ACCESS_TOKEN_VALIDITY_DAYS