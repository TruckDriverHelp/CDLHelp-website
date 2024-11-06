import React from 'react';

const CVOCard = ({ locale, questionEn, answerEn, questionLang, answerLang }) => {
  return (
    <div className="tx-quiz-card" style={{ gridTemplateColumns: locale == "en" ? "auto" : "1fr 30px 1fr" }}>
      <div className="tx-quiz-card-column">
        <div>{questionEn}</div>
        <div>{answerEn}</div>
      </div>

      {!(locale == "en") &&
        <>
          <div className="tx-card-line"></div>

          <div className="tx-quiz-card-column">
            <div>{questionLang}</div>
            <div>{answerLang}</div>
          </div>
        </>
      }
    </div>
  );
};

export default CVOCard;
