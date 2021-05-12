import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

connectDB()

const app = express()

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID))

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))  //Taking us to 'uploads' folder & making it static with express.static()
//path.join() - to join different segments of files
//__dirname -> points to current directory
//However, since it's only available if we're using common js & not available using es module, so we mimic it using path.resolve() 

if(process.env.NODE_ENV === 'production') { //This will be 'production' when we deploy to the server
    app.use(express.static(path.join(__dirname, '/frontend/build')))
    
    app.get('*', (req, res) =>   //Anything other than the above API routes (any route that is NOT an API)
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')) //It is going to point to 'index.html' file
    )
} else {  //If not in PRODUCTION Stage i.e. when in DEVELOPMENT Stage
    app.get('/', (req, res) => {
        res.send('API is running....')
    })
}

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))