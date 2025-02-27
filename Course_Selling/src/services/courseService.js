import Course from "../models/Course";

export const createCourse = async(title,description,price,instructor,categories) => {
    const course = await Course.create({
        title,
        description,
        price,
        instructor,
        categories
    });
    return course;
}
