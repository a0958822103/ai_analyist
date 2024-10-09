import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import AnalyzePage from "./AnalyzePage";  // 將新頁面的組件引入
import "./index.css"

function Home() {
  const [userInput, setUserInput] = useState("");
  const navigate = useNavigate(); // 用於頁面跳轉

  const handleAnalyze = async () => {
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_input: userInput,  // 將用戶輸入發送到後端
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        // 跳轉到 /result 並傳遞後端返回的數據作為狀態
        navigate("/result", { state: { 
          swot_analysis: data.swot_analysis,
          self_introduction: data.self_introduction 
      }});
      } else {
        const errorData = await response.json();
        navigate("/result", { state: { result: errorData.error } });
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/result", { state: { result: "請求失敗，請稍後再試" } });
    }
  };

  return (
    <div className="analyist">
      <h1>企業分析 RAG</h1>
      <input
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="請輸入企業名稱或問題..."
        rows={4}
        cols={50}
      />
      <button onClick={handleAnalyze}>分析</button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* 首頁，輸入企業名稱的地方 */}
        <Route path="/" element={<Home />} />
        {/* 分析結果頁面 */}
        <Route path="/result" element={<AnalyzePage />} />
      </Routes>
    </Router>
  );
}

export default App;
