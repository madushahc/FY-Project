import mongoose from 'mongoose';
import Course from './src/models/Course.js';
async function test() {
    await mongoose.connect('mongodb://127.0.0.1/eduquest');
    try {
        const courseData = {
            title: 'Test Course',
            code: 'TEST101',
            description: 'Test description',
            instructor: new mongoose.Types.ObjectId(),
            status: 'Published'
        };
        const c = new Course(courseData);
        await c.validate();
        console.log('Validation passed!');
    }
    catch (error) {
        console.error('Validation Error:', JSON.stringify(error, null, 2));
    }
    process.exit(0);
}
test();
//# sourceMappingURL=test-course.js.map