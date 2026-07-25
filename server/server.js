const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 5001;

db.sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
  });

module.exports = app;
