import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AnalyzePage.css";  // 引入 CSS 檔案進行樣式設計

function AnalyzePage() {
  const location = useLocation();  // 取得來自 Home 頁面的狀態
  const navigate = useNavigate();  // 用來實現返回首頁的跳轉
  
  const result1 = location.state?.swot_analysis || "沒有結果";  // 從狀態中提取分析結果
  const result2 = location.state?.self_introduction || "";  // 從狀態中提取自我介紹
  const resultArray = result1.split('\n');  // 將 swot 分析結果按換行符號分割

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
          <p>企業: 長榮海運</p>
          <p>代表人: 張衍義</p>
          <p>產業類別: 儲配／運輸物流業</p>
          <p>資本額: 700億元(新台幣)</p>
          <p>員工人數: 職員有9660人、海勤有2961人，共計12621名員工。</p>
          <p>地址: 台北市中山區民生東路二段166號1-4樓。</p>
          <p>公司願景: 1.創造利潤 2.照顧員工 3.回饋社會 4.持續創新 5.誠信經營。</p>
        </div>
      </div>

      {/* 分析摘要部分 */}
      <div className="report-section">
        <h2 onClick={() => setShowAnalysisSummary(!showAnalysisSummary)}>
          分析摘要
        </h2>
        <div className={`content ${showAnalysisSummary ? "show" : ""}`}>
          {resultArray.length > 0 ? (
            resultArray.map((line, index) => (
              <blockquote key={index} className="highlighted-result">
                {line}
              </blockquote>
            ))
          ) : (
            <p>沒有找到相關分析摘要。</p>
          )}
        </div>
      </div>

      {/* 自我介紹部分，僅在 result2 存在時顯示 */}
      {result2 && (
        <div className="report-section">
          <h2 onClick={() => setShowSelfIntroduction(!showSelfIntroduction)}>
            自我介紹建議
          </h2>
          <div className={`content ${showSelfIntroduction ? "show" : ""}`}>
            <p>{result2}</p>
          </div>
        </div>
      )}

      <hr className="divider" />
      
      {/* 返回首頁按鈕 */}
      <button className="back-button" onClick={() => navigate("/")}>
        返回首頁
      </button>
    </div>
  );
}

export default AnalyzePage;
