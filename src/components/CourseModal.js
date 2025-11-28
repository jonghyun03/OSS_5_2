import React, { useState, useEffect, useRef } from 'react';

function CourseModal({ show, onClose, onSave, title, course }) {
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [credit, setCredit] = useState('');
  const [mandatory, setMandatory] = useState(true);

  // useRef를 활용한 유효성 체크
  const nameRef = useRef(null);
  const majorRef = useRef(null);
  const creditRef = useRef(null);

  useEffect(() => {
    if (course) {
      setName(course.name || '');
      setMajor(course.major || '');
      setCredit(course.credit?.toString() || '');
      setMandatory(course.mandatory !== undefined ? course.mandatory : true);
    } else {
      clearInputs();
    }
  }, [course, show]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && show) {
        clearInputs();
        onClose();
      }
    };
    if (show) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [show, onClose]);

  const clearInputs = () => {
    setName('');
    setMajor('');
    setCredit('');
    setMandatory(true);
    // ref 스타일 초기화
    if (nameRef.current) {
      nameRef.current.style.borderColor = '';
      nameRef.current.removeAttribute('title');
    }
    if (majorRef.current) {
      majorRef.current.style.borderColor = '';
      majorRef.current.removeAttribute('title');
    }
    if (creditRef.current) {
      creditRef.current.style.borderColor = '';
      creditRef.current.removeAttribute('title');
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

  const handleSave = () => {
    if (!validateInputs()) {
      alert(`입력한 정보를 확인해주세요!`);
      return;
    }

    const courseData = {
      name: name.trim(),
      major: major.trim(),
      credit: parseInt(credit),
      mandatory: mandatory,
    };

    onSave(courseData);
  };

  const handleClose = () => {
    clearInputs();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        onClick={handleBackdropClick}
      ></div>
      <div
        className="modal fade show"
        style={{ display: 'block' }}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        onClick={handleBackdropClick}
      >
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {title}
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="inputs">
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
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                취소
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                {course ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseModal;

