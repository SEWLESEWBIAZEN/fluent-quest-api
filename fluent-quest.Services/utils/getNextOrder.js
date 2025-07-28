const contentsModel = require('../../fluent-quest.Domain/model/content.model'); // Adjust the path as necessary
async function getNextOrder(lessonId) {
  const lastContent = await contentsModel.findOne({ lessonId })
    .sort({ order: -1 }) // sort by descending order
    .select('order');     // only get the order field

  return lastContent ? lastContent.order + 1 : 1;
};

module.exports = getNextOrder;
