import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = "https://69153ff184e8bd126af9369c.mockapi.io/api/hw4/courses";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCourse(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchCourse = async (courseId) => {
    try {
      const response = await fetch(`${API_URL}/${courseId}`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCourse(data);
      } else {
        console.error('Failed to fetch course:', response.status, response.statusText);
        alert("강의 정보를 불러오는데 실패했습니다.");
        navigate('/list');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      alert("강의 정보를 불러오는데 실패했습니다.");
      navigate('/list');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/list');
  };

  const handleEdit = () => {
    if (course) {
      navigate(`/update/${course.id}`);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div>로딩 중...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="page">
        <div>강의 정보를 찾을 수 없습니다.</div>
        <button onClick={handleBack} className="btn btn-primary">
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <h3>강의 상세 정보</h3>
      <div style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <strong>과목명:</strong> {course.name}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>전공:</strong> {course.major}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>학점:</strong> {course.credit}학점
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>필수여부:</strong> {course.mandatory ? "필수" : "선택"}
        </div>
      </div>
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
        <button onClick={handleBack} className="btn btn-secondary">
          목록으로
        </button>
        <button onClick={handleEdit} className="btn btn-primary">
          수정하기
        </button>
      </div>
    </div>
  );
}

export default Detail;

