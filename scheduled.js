const cron = require('node-cron');
const User = require("./models/user.model");
const { updateUserRankById } = require('./services/user.service');

const checkCreators = async () => {
  try {
    
    const creators = await User.findAll({ where: { role: 'creator' } });
    console.log("Creators count: ", creators.length)

    creators.forEach(creator => {
      console.log(`Checking creator: ${creator.name}`);
      updateUserRankById(creator.id)  
    });
  } catch (error) {
    console.error('Error checking creators:', error);
  }
};

// Schedule the job to run every Monday at 00:00 (midnight)
cron.schedule('0 0 * * 1', () => {
  console.log('Running the scheduled task to check creators...');
  checkCreators();
});

// checkCreators().catch(console.error);
