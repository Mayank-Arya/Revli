// controllers/doubtController.js

const User = require('../model/users');
const TutorAvailability = require('../model/tutorAvailability');
const DoubtRequest = require('../model/doubtRequest');

const findEligibleTutors = async (studentId, doubtSubject) => {
  try {
    // Find online tutors matching the student's criteria
    const eligibleTutors = await TutorAvailability.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'tutorId',
          foreignField: '_id',
          as: 'tutorInfo',
        },
      },
      {
        $match: {
          'tutorInfo.userType': 'Tutor',
          'tutorInfo.subjectExpertise': doubtSubject,
          'tutorInfo.classGrade': { $gte: 1 }, // Adjust the range as needed
        },
      },
    ]);

    // Notify eligible tutors (you can implement your notification mechanism here)

    // Create a doubt request record
    await DoubtRequest.create({ studentId, doubtSubject });

    console.log('Eligible tutors notified:', eligibleTutors);
  } catch (error) {
    console.error(error);
    throw new Error('Error finding eligible tutors');
  }
};

module.exports = { findEligibleTutors };
