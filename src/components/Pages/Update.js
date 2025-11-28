import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = "https://69153ff184e8bd126af9369c.mockapi.io/api/hw4/courses";

function Update() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [credit, setCredit] = useState('');
  const [mandatory, setMandatory] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updateCount, setUpdateCount] = useState(0);
  const [initialData, setInitialData] = useState(null);

  // useRef를 활용한 유효성 체크
  const nameRef = useRef(null);
  const majorRef = useRef(null);
  const creditRef = useRef(null);
  
  // debounce를 위한 timeout ref
  const updateTimeoutRef = useRef(null);

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
        setName(data.name || '');
        setMajor(data.major || '');
        setCredit(data.credit?.toString() || '');
        setMandatory(data.mandatory !== undefined ? data.mandatory : true);
        setInitialData(data);
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

  const validateInputs = () => {
    let isValid = true;

    // 과목명 유효성 체크
    if (!name.trim()) {
      if (nameRef.current) {
        nameRef.current.style.borderColor = 'red';
        nameRef.current.setAttribute('title', '과목명을 입력해주세요.');
      }
      isValid = false;
    } else {
      if (nameRef.current) {
        nameRef.current.style.borderColor = '';
        nameRef.current.removeAttribute('title');
      }
    }

    // 전공 유효성 체크
    if (!major.trim()) {
      if (majorRef.current) {
        majorRef.current.style.borderColor = 'red';
        majorRef.current.setAttribute('title', '전공을 입력해주세요.');
      }
      isValid = false;
    } else {
      if (majorRef.current) {
        majorRef.current.style.borderColor = '';
        majorRef.current.removeAttribute('title');
      }
    }

    // 학점 유효성 체크
    const creditNum = parseInt(credit);
    if (!credit.trim() || isNaN(creditNum) || creditNum < 1 || creditNum > 5) {
      if (creditRef.current) {
        creditRef.current.style.borderColor = 'red';
        creditRef.current.setAttribute('title', '학점은 1~5 사이의 숫자를 입력해주세요.');
      }
      isValid = false;
    } else {
      if (creditRef.current) {
        creditRef.current.style.borderColor = '';
        creditRef.current.removeAttribute('title');
      }
    }

    return isValid;
  };

  const updateCourse = async () => {
    if (!validateInputs()) {
      return;
    }

    // 초기 데이터와 비교하여 실제로 변경이 있는지 확인
    if (initialData) {
      const trimmedName = name.trim();
      const trimmedMajor = major.trim();
      const creditNum = parseInt(credit);
      
      if (
        trimmedName === initialData.name &&
        trimmedMajor === initialData.major &&
        creditNum === initialData.credit &&
        mandatory === initialData.mandatory
      ) {
        // 변경사항이 없으면 API 호출하지 않음
        return;
      }
    }

    const courseData = {
      name: name.trim(),
      major: major.trim(),
      credit: parseInt(credit),
      mandatory: mandatory,
    };

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
      if (response.ok) {
        setUpdateCount(prev => prev + 1);
        // 업데이트 후 initialData도 업데이트하여 다음 비교에 사용
        setInitialData(courseData);
      } else {
        console.error('Failed to update course:', response.status, response.statusText);
        alert("강의 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert("강의 수정에 실패했습니다.");
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    // debounce: 500ms 후에 API 호출
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      updateCourse();
    }, 500);
  };

  const handleMajorChange = (e) => {
    setMajor(e.target.value);
    // debounce: 500ms 후에 API 호출
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      updateCourse();
    }, 500);
  };

  const handleCreditChange = (e) => {
    setCredit(e.target.value);
    // debounce: 500ms 후에 API 호출
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      updateCourse();
    }, 500);
  };

  const handleMandatoryChange = (value) => {
    setMandatory(value);
    // debounce: 500ms 후에 API 호출
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      updateCourse();
    }, 500);
  };

  // 컴포넌트 언마운트 시 timeout 정리
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const handleCancel = () => {
    navigate('/list');
  };

  if (loading) {
    return (
      <div className="page">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <h3>강의 수정</h3>
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <strong>총 수정 횟수: {updateCount}회</strong>
      </div>
      <div className="inputs" style={{ marginTop: '20px' }}>
        <input
          ref={nameRef}
          type="text"
          className="form-control"
          placeholder="과목명"
          aria-label="과목명"
          value={name}
          onChange={handleNameChange}
          onBlur={validateInputs}
        />
        <input
          ref={majorRef}
          type="text"
          className="form-control"
          placeholder="전공"
          aria-label="전공"
          value={major}
          onChange={handleMajorChange}
          onBlur={validateInputs}
        />
        <input
          ref={creditRef}
          type="number"
          className="form-control"
          placeholder="학점"
          aria-label="학점"
          min="1"
          max="5"
          step="1"
          value={credit}
          onChange={handleCreditChange}
          onBlur={validateInputs}
        />
        <div style={{ display: 'flex', gap: '30px' }}>
          <div>
            <input
              type="radio"
              id="courseMandatoryTrue"
              name="courseMandatory"
              className="form-check-input"
              checked={mandatory === true}
              onChange={() => handleMandatoryChange(true)}
            />
            <label htmlFor="courseMandatoryTrue">필수</label>
          </div>
          <div>
            <input
              type="radio"
              id="courseMandatoryFalse"
              name="courseMandatory"
              className="form-check-input"
              checked={mandatory === false}
              onChange={() => handleMandatoryChange(false)}
            />
            <label htmlFor="courseMandatoryFalse">선택</label>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          목록으로
        </button>
      </div>
    </div>
  );
}

export default Update;

