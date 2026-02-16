import Course from '../models/Course.js';
import Attendance from '../models/Attendance.js';

export const getCourses = async (req, res) => {
  try {
    const { role, id } = req.user;

    let query = {};
    if (role === 'Lecturer') {
      query.lecturer = id;
    } else if (role === 'Student') {
      query.students = id;
    }

    const courses = await Course.find(query)
      .populate('lecturer', 'fullName email')
      .populate('students', 'fullName email studentId');

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('lecturer', 'fullName email')
      .populate('students', 'fullName email studentId');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    if (req.user.role !== 'Lecturer') {
      return res.status(403).json({
        success: false,
        message: 'Only lecturers can create courses',
      });
    }

    const course = new Course({
      ...req.body,
      lecturer: req.user.id,
    });

    await course.save();

    res.status(201).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { role, id } = req.user;

    let query = { course: courseId };
    if (role === 'Student') {
      query.student = id;
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'fullName email studentId')
      .populate('course', 'code title');

    res.json({
      success: true,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { courseId: bodyCourseId, studentId: bodyStudentId, status: bodyStatus } = req.body;
    const courseId = req.params.courseId || bodyCourseId;

    // If student is marking their own attendance
    if (req.user.role === 'Student') {
      const attendanceDoc = new Attendance({
        course: courseId,
        student: req.user.id,
        status: bodyStatus || 'Present',
        checkInTime: new Date(),
        date: new Date(),
      });

      try {
        await attendanceDoc.save();
        return res.status(201).json({ success: true, attendance: attendanceDoc });
      } catch (err) {
        // Duplicate entry (already marked)
        if (err && err.code === 11000) {
          return res.status(200).json({ success: false, message: 'Attendance already recorded for today.' });
        }
        throw err;
      }
    }

    // If lecturer/admin marking attendance on behalf of a student
    if (req.user.role === 'Lecturer' || req.user.role === 'Admin') {
      if (!bodyStudentId) {
        return res.status(400).json({ success: false, message: 'studentId is required' });
      }

      const attendance = new Attendance({
        course: courseId,
        student: bodyStudentId,
        status: bodyStatus || 'Present',
        checkInTime: new Date(),
        date: new Date(),
      });

      try {
        await attendance.save();
        return res.status(201).json({ success: true, attendance });
      } catch (err) {
        if (err && err.code === 11000) {
          return res.status(200).json({ success: false, message: 'Attendance already recorded for today.' });
        }
        throw err;
      }
    }

    return res.status(403).json({ success: false, message: 'Not authorized to mark attendance' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getAttendanceStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { id } = req.user;

    const stats = await Attendance.aggregate([
      {
        $match: {
          course: courseId,
          student: id,
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
