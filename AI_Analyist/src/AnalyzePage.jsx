import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AnalyzePage.css";  // 引入 CSS 檔案進行樣式設計

function AnalyzePage() {
  const location = useLocation();  // 取得來自 Home 頁面的狀態
  const navigate = useNavigate();  // 用來實現返回首頁的跳轉
  
  const result1 = location.state?.enterprise_introduce || "沒有結果"; 
  const result2 = location.state?.swot_analysis || "沒有結果";  // 從狀態中提取分析結果
  const result3 = location.state?.self_introduction || "";  

  const resultArray1 = result1.split('\n'); 
  const resultArray2 = result2.split('\n');  // 將 swot 分析結果按換行符號分割
  const resultArray3 = result3.split('\n');

  // 定義狀態來控制各個部分是否顯示
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);
  const [showAnalysisSummary, setShowAnalysisSummary] = useState(false);
  const [showSelfIntroduction, setShowSelfIntroduction] = useState(false);

  return (
    <div className="report-container">
      <h1 className="report-title">企業分析報告</h1>
      <hr className="divider" />
      
      {/* 公司簡介部分 */}
      <div className="report-section">
        <h2 onClick={() => setShowCompanyInfo(!showCompanyInfo)}>
          公司簡介
        </h2>
        <div className={`content ${showCompanyInfo ? "show" : ""}`}>
            {resultArray1.length > 0 ?
            (
              resultArray1.map((line, index) => (
              <blockquote key={index} className="highlighted-result">
                {line}
              </blockquote>
            ))
          ) : 
          (
            <p>沒有找到相關分析摘要。</p>
          )}
        </div>
      </div>

      {/* 分析摘要部分 */}
      <div className="report-section">
        <h2 onClick={() => setShowAnalysisSummary(!showAnalysisSummary)}>
          分析摘要
        </h2>
        <div className={`content ${showAnalysisSummary ? "show" : ""}`}>
          {resultArray2.length > 0 ? (
            resultArray2.map((line, index) => (
              <blockquote key={index} className="highlighted-result">
                {line}
              </blockquote>
            ))
          ) : (
            <p>沒有找到相關分析摘要。</p>
          )}
        </div>
      </div>

      {/* 自我介紹部分 */}
      <div className="report-section">
        <h2 onClick={() => setShowSelfIntroduction(!showSelfIntroduction)}>
          自我介紹建議
        </h2>
        <div className={`content ${showSelfIntroduction ? "show" : ""}`}>
          {resultArray3.length > 0 ? (
            resultArray3.map((line, index) => (
              <blockquote key={index} className="highlighted-result">
                {line}
              </blockquote>
            ))
          ) : (
            <p>沒有找到相關分析摘要。</p>
          )}
        </div>
      </div>

      <hr className="divider" />
      
      {/* 返回首頁按鈕 */}
      <button className="back-button" onClick={() => navigate("/")}>
        返回首頁
      </button>
    </div>
  );
}

export default AnalyzePage;
