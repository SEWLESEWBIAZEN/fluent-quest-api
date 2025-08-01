const contentsModel = require('../../fluent-quest.Domain/model/content.model'); 
const lessonsModel = require('../../fluent-quest.Domain/model/lesson.model');
async function getNextContentOrder(lessonId) {
  const lastContent = await contentsModel.findOne({ lessonId })
    .sort({ order: -1 }) 
    .select('order');     

  return lastContent ? lastContent.order + 1 : 1;
};
async function getNextLessonOrder(courseId) {
  const lastLesson = await lessonsModel.findOne({ course_id: courseId })
    .sort({ order: -1 }) 
    .select('order');     

  return lastLesson ? lastLesson.order + 1 : 1;
};



module.exports = {getNextContentOrder,getNextLessonOrder};
