import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AnalyzePage.css";  // 引入 CSS 檔案進行樣式設計

function AnalyzePage() {
  const location = useLocation();  // 取得來自 Home 頁面的狀態
  const navigate = useNavigate();  // 用來實現返回首頁的跳轉
  const result = location.state?.result || "沒有結果";  // 從狀態中提取分析結果
  const resultArray = result.split('\n'); 
  
  return (
    <div className="report-container">
      <h1 className="report-title">企業分析報告</h1>
      <hr className="divider" />
      <div className="report-section">
        <h2>公司簡介</h2>
        <p>
          代表人:張衍義
        </p>
        <p>
          產業類別:儲配／運輸物流業
        </p>
        <p>
          資本額:700億元(新台幣)
        </p>
        <p>
          員工人數:職員有9660人、海勤有2961人，共計12621名員工。
        </p>
        <p>
          地址:台北市中山區民生東路二段166號1-4樓。
        </p>
        <p>
          公司願景: 1.創造利潤 2.照顧員工 3.回饋社會 4.持續創新 5.誠信經營。
        </p>
      </div>

      <div className="report-section">
      <h2>分析摘要</h2>
      {resultArray.map((line, index) => (
          <blockquote key={index} className="highlighted-result">
          {line}
          </blockquote>))}
      </div>

      {/* <div className="report-section">
        <h2>關鍵發現與結論</h2>
        <p>
          此部分將根據數據詳細說明主要發現。例如財務數據、競爭分析、市場趨勢等。
        </p>
      </div> */}


      <hr className="divider" />
      <button className="back-button" onClick={() => navigate("/")}>
        返回首頁
      </button>
    </div>
  );
}

export default AnalyzePage;
