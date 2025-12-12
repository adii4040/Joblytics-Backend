import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'


const app = express()


app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static('public'))
app.use(cookieParser())


//import the routes here
import healthCheckRoute from './routes/healthCheck.route.js'
import userRoutes from './routes/user.route.js'
import applicationRoutes from './routes/application.route.js'
import analyticsRoutes from './routes/analytics.route.js'

//use the routes here

app.use('/api/v1/healthcheck', healthCheckRoute)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/application', applicationRoutes)
app.use('/api/v1/analytics', analyticsRoutes)


// Global error handler (must come after all routes)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    statusCode:statusCode,
    success: false,
    message,
    errors: err.errors || [],
    data: null,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});


export {app}