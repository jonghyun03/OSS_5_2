import React, { useState, useEffect } from 'react';

function CourseModal({ show, onClose, onSave, title, course }) {
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [credit, setCredit] = useState('');
  const [mandatory, setMandatory] = useState(true);

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
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedMajor = major.trim();
    const trimmedCredit = credit.trim();

    if (!trimmedName || !trimmedMajor || !trimmedCredit) {
      alert(`비어있는 항목이 있어 ${course ? '강의 수정' : '강의 추가'}이 불가능합니다!`);
      return;
    }

    const courseData = {
      name: trimmedName,
      major: trimmedMajor,
      credit: parseInt(trimmedCredit),
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
                  type="text"
                  className="form-control"
                  placeholder="과목명"
                  aria-label="과목명"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="전공"
                  aria-label="전공"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                />
                <input
                  type="number"
                  className="form-control"
                  placeholder="학점"
                  aria-label="학점"
                  min="1"
                  max="5"
                  step="1"
                  value={credit}
                  onChange={(e) => setCredit(e.target.value)}
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

