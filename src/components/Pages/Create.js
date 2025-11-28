import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://69153ff184e8bd126af9369c.mockapi.io/api/hw4/courses";

function Create() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [credit, setCredit] = useState('');
  const [mandatory, setMandatory] = useState(true);

  // useRef를 활용한 유효성 체크
  const nameRef = useRef(null);
  const majorRef = useRef(null);
  const creditRef = useRef(null);

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

  const handleSave = async () => {
    if (!validateInputs()) {
      alert("입력한 정보를 확인해주세요!");
      return;
    }

    const courseData = {
      name: name.trim(),
      major: major.trim(),
      credit: parseInt(credit),
      mandatory: mandatory,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });
      if (response.ok || response.status === 201) {
        alert("강의 추가가 완료되었습니다!");
        navigate('/list');
      } else {
        console.error('Failed to add course:', response.status, response.statusText);
        alert("강의 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert("강의 추가에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    navigate('/list');
  };

  return (
    <div className="page">
      <h3>강의 추가</h3>
      <div className="inputs" style={{ marginTop: '20px' }}>
        <input
          ref={nameRef}
          type="text"
          className="form-control"
          placeholder="과목명"
          aria-label="과목명"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={validateInputs}
        />
        <input
          ref={majorRef}
          type="text"
          className="form-control"
          placeholder="전공"
          aria-label="전공"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
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
          onChange={(e) => setCredit(e.target.value)}
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
              onChange={() => setMandatory(true)}
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
              onChange={() => setMandatory(false)}
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
          취소
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
        >
          추가
        </button>
      </div>
    </div>
  );
}

export default Create;

