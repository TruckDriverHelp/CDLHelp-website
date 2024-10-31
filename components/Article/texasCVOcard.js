import React from 'react';

const CVOCard = ({ locale, questionEn, answerEn, questionLang, answerLang }) => {
  return (
    <div className="tx-quiz-card">
      <div className="tx-quiz-card-column">
        <div>{questionEn}</div>
        <div>{answerEn}</div>
      </div>
      <div className="tx-card-line"></div>

      {!(locale == "en") &&
          <div className="tx-quiz-card-column">
            <div>{questionLang}</div>
            <div>{answerLang}</div>
          </div>
      }
    </div>
  );
};

export default CVOCard;
