const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// routers list
const userRoutes = require('./routes/user.routes.js');
const courseRoutes = require('./routes/course.routes.js');
const walletRoutes = require('./routes/wallet.routes');
const transactionRoutes = require('./routes/transaction.routes');
const tarifZoneRoutes = require('./routes/tarifZone.routes');
const quartierRoutes = require('./routes/quartier.routes');
const zoneRoutes = require('./routes/zone.routes');

require('dotenv').config({path: './config/.env'});
require('./config/db');
const {checkUser, requireAuth} = require('./middleware/auth.middleware');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
});

//routes
app.use('/api/user', userRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/wallet', walletRoutes);

app.use('/api/transaction', transactionRoutes);
app.use('/api/zone', zoneRoutes);
app.use('/api/quartier', quartierRoutes);
app.use('/api/tarifZone', tarifZoneRoutes);

// server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
})
