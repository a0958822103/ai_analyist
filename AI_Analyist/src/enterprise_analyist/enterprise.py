from flask import Flask, request, jsonify
import ollama
import chromadb
import pandas as pd
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 初始化資料庫
def setup_database():
    client = chromadb.Client()
    file_path = 'AI_Shipping information.json'
    documents = pd.read_json(file_path)
    collection = client.get_or_create_collection(name="demodocs")

    for index, content in documents.iterrows():
        try:
            response = ollama.embeddings(model="mxbai-embed-large", prompt=content['instruction'])
            collection.add(
                ids=[str(index)], 
                embeddings=[response["embedding"]], 
                documents=[content['output']]
            )
        except ollama._types.ResponseError as e:
            print(f"API 錯誤: {e}")
            continue
    
    return collection

# 檢查中英文字符比例
def is_chinese_input_valid(user_input):
    chinese_chars = re.findall(r'[\u4e00-\u9fff]', user_input)
    english_chars = re.findall(r'[a-zA-Z]', user_input)

    total_chars = len(chinese_chars) + len(english_chars)
    if total_chars == 0:
        return True
    english_ratio = len(english_chars) / total_chars
    return english_ratio <= 0.7

# 處理企業分析請求
def handle_user_input(user_input, collection):
    # 生成用戶輸入的嵌入向量
    response = ollama.embeddings(prompt=user_input, model="mxbai-embed-large")
    results = collection.query(query_embeddings=[response["embedding"]], n_results=3)

    if results['documents']:
        # 使用第一個查詢結果生成第一個輸出的分析
        data = results['documents'][0]
        
        # 第一個 prompt 生成的結果
        expand_response = ollama.generate(
            model="ycchen/breeze-7b-instruct-v1_0",
            prompt=f"你是位針對{user_input}企業分析師，請使用以下資料對{user_input}進行企業分析 (SWOT分析)，請按不同標題進行換行：\n\n"
                   f"{data}\n\n請用繁體中文回答問題，並請將每個部分進行分段。"
        )
        swot_analysis = expand_response['response']
        
        # 生成第二個 prompt 的結果 (這是另一個獨立的分析，與第一個無關)
        introduction_response = ollama.generate(
            model="ycchen/breeze-7b-instruct-v1_0",
            prompt=f"你是位面試官，請使用以下資料對面試者進行一個自我介紹的建議(須包含讓求職者介紹個人經歷、與{user_input}類別相關的經驗、自身優勢):\n\n"
                    f"{data}\n\n請用繁體中文回答問題，並請將每個部分進行分段。"
        )
        self_introduction = introduction_response['response']
        
        # 返回兩個結果，你可以選擇合併它們或者分開傳回
        return {
            "swot_analysis": swot_analysis,
            "self_introduction": self_introduction 
        }

    else:
        return "沒有找到相關的回答。"

# Flask 路由 - 處理企業分析的 API
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    print(data)
    user_input = data.get("user_input")

    if not user_input: 
        return jsonify({"error": "請輸入問題"}), 400

    if not is_chinese_input_valid(user_input):
        return jsonify({"error": "請輸入中文！"}), 400

    collection = setup_database()
    result = handle_user_input(user_input, collection)
    swot_analysis = result.get('swot_analysis')
    self_introduction = result.get('self_introduction')

    if swot_analysis and self_introduction:
        return jsonify({
            "swot_analysis": swot_analysis,
            "self_introduction": self_introduction
        })
    else:
        return jsonify({"error": "沒有找到相關的回答。"}), 404

if __name__ == "__main__":
    app.run(debug=False,use_reloader=False)
