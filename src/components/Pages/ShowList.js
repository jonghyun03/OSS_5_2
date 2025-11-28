import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseModal from '../CourseModal';
import styles from './ShowList.module.css';

const API_URL = "https://69153ff184e8bd126af9369c.mockapi.io/api/hw4/courses";

function ShowList() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [modalTitle, setModalTitle] = useState("강의 추가");

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        console.error('Failed to fetch courses:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleAddClick = () => {
    navigate('/create');
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setModalTitle("강의 수정");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await getCourses();
        alert("강의 삭제가 완료되었습니다!");
      } else {
        console.error('Failed to delete course:', response.status, response.statusText);
        alert("강의 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert("강의 삭제에 실패했습니다.");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  const handleModalSave = async (courseData) => {
    try {
      if (editingCourse) {
        // Update existing course
        const response = await fetch(`${API_URL}/${editingCourse.id}`, {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });
        if (response.ok) {
          await getCourses();
          setShowModal(false);
          setEditingCourse(null);
          alert("강의 수정이 완료되었습니다!");
        } else {
          console.error('Failed to update course:', response.status, response.statusText);
          alert("강의 수정에 실패했습니다.");
        }
      } else {
        // Add new course
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });
        if (response.ok || response.status === 201) {
          await getCourses();
          setShowModal(false);
          alert("강의 추가가 완료되었습니다!");
        } else {
          console.error('Failed to add course:', response.status, response.statusText);
          alert("강의 추가에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert(editingCourse ? "강의 수정에 실패했습니다." : "강의 추가에 실패했습니다.");
    }
  };

  return (
    <div className="page">
      <h3>
        한동대학교 AI컴공심화 강의 목록
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddClick}
        >
강의 추가
        </button>
      </h3>
      <div className={styles.courseListContainer}>
        {courses.length === 0 ? (
          <div className={styles.emptyState}>
            등록된 강의가 없습니다. 강의를 추가해보세요!
          </div>
        ) : (
          <>
            <div className={styles.tableHeader}>
              <div>과목명</div>
              <div>전공</div>
              <div>학점</div>
              <div>필수여부</div>
              <div>삭제</div>
            </div>
            {courses.map((course) => (
              <div key={course.id} className={styles.courseRow}>
                <div className={styles.courseCell}>
                  <p
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/detail/${course.id}`);
                    }}
                    className={`${styles.cursorPointer} ${styles.courseName}`}
                  >
                    {course.name}
                  </p>
                </div>
                <div className={`${styles.courseCell} ${styles.courseMajor}`}>
                  {course.major}
                </div>
                <div className={`${styles.courseCell} ${styles.courseCredit}`}>
                  {course.credit}학점
                </div>
                <div className={styles.courseCell}>
                  <span
                    className={`${styles.mandatoryBadge} ${
                      course.mandatory ? styles.required : styles.optional
                    }`}
                  >
                    {course.mandatory ? "필수" : "선택"}
                  </span>
                </div>
                <div className={styles.courseCell}>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className={`btn btn-danger ${styles.deleteButton}`}
                  >
삭제
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <CourseModal
        show={showModal}
        onClose={handleModalClose}
        onSave={handleModalSave}
        title={modalTitle}
        course={editingCourse}
      />
    </div>
  );
}

export default ShowList;

