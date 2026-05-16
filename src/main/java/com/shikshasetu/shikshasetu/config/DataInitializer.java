package com.shikshasetu.shikshasetu.config;

import com.shikshasetu.shikshasetu.model.Course;
import com.shikshasetu.shikshasetu.model.CourseContent;
import com.shikshasetu.shikshasetu.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.ArrayList;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(CourseRepository repo) {
        return args -> {

            if (repo.count() == 0) {
                System.out.println(" Database is empty. Starting ShikshaSetu seeding process...");

                //  1. JAVA (Programming)
                Course java = createCourse("Java Mastery", "Complete Core Java to Spring Boot 3.5 guide.", "Programming", "https://www.geeksforgeeks.org/java/");
                addLesson(java, "JVM Architecture", "https://www.geeksforgeeks.org/jvm-works-jvm-architecture/", 1);
                addLesson(java, "Variables & Data Types", "https://www.geeksforgeeks.org/data-types-in-java/", 2);
                addLesson(java, "Spring Boot Basics", "https://www.geeksforgeeks.org/spring-boot/", 3);
                repo.save(java);

                //  2. PYTHON (Programming)
                Course py = createCourse("Python for AI", "Master Python for Data Science and Machine Learning.", "Programming", "https://www.geeksforgeeks.org/python-programming-language/");
                addLesson(py, "Python Installation", "https://www.geeksforgeeks.org/how-to-install-python-on-windows/", 1);
                addLesson(py, "List & Dictionaries", "https://www.geeksforgeeks.org/python-lists/", 2);
                repo.save(py);

                //  3. DATABASE (Technology)
                Course sql = createCourse("PostgreSQL Essentials", "Relational database design and SQL queries.", "Technology", "https://www.geeksforgeeks.org/postgresql-tutorial/");
                addLesson(sql, "Intro to SQL", "https://www.geeksforgeeks.org/sql-tutorial/", 1);
                repo.save(sql);

                //  4. Loop to add more variety (30 courses total)
                for(int i = 1; i <= 9; i++) {
                    repo.save(createCourse("Technology Course " + i, "Latest tech trends and tools.", "Technology", "https://www.geeksforgeeks.org/"));
                    repo.save(createCourse("Business Strategy " + i, "Entrepreneurship and marketing skills.", "Business", "https://www.geeksforgeeks.org/"));
                    repo.save(createCourse("Advanced Programming " + i, "Deep dive into algorithms.", "Programming", "https://www.geeksforgeeks.org/"));
                }

                System.out.println(" Seeding complete! 30 courses are ready for the Admin Panel.");
            } else {
                System.out.println(" Database already contains data. Skipping DataInitializer.");
            }
        };
    }

    private Course createCourse(String title, String desc, String cat, String link) {
        Course c = new Course();
        c.setTitle(title);
        c.setDescription(desc);
        c.setCategory(cat);
        c.setCourseLink(link);
        c.setLevel("Beginner");

        c.setThumbnailUrl("https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg");

        // Ensure the list is initialized to prevent NullPointerException
        if (c.getContents() == null) {
            c.setContents(new ArrayList<>());
        }
        return c;
    }

    private void addLesson(Course course, String title, String url, int index) {
        CourseContent content = new CourseContent();
        content.setTitle(title);
        content.setContentUrl(url);
        content.setOrderIndex(index);
        content.setCourse(course); // Set the parent course back-reference

        if (course.getContents() == null) {
            course.setContents(new ArrayList<>());
        }
        course.getContents().add(content);
    }
}