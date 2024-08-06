import express from 'express';
import morgan from 'morgan';
import { db } from './models';
import userRoutes from './routes/userRoutes';
import passRoutes from './routes/passRoutes';
import { scheduleTargetTimeExecution } from './services/scheduledFuntions';

const app = express();

app.use(morgan('dev'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// incoming requests
const cors = require('cors');
app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/pass', passRoutes);


app.use((req, res, next) => {
  res.status(404).send("error");
});


//scheduling resetting password attempts
scheduleTargetTimeExecution(24, 50);
//hour/day


// Syncing DB
db.sync().then(() => {
  console.info("Connected to the database!");
});

app.listen(3001);