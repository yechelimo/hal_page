import json
import sys

def fix_json_file(file_path):
    try:
        # 先尝试读取原始文件
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 使用eval来解析内容（因为JSON格式有问题，但Python字典语法可能能识别）
        # 注意：只在我们自己控制的文件上使用这种方法
        data = eval(content)
        
        # 将数据正确序列化为JSON
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"成功修复JSON文件: {file_path}")
        return True
    except Exception as e:
        print(f"修复JSON文件失败: {e}")
        return False

if __name__ == "__main__":
    files_to_fix = [
        "/workspace/courses/data/data-analysis.json",
        "/workspace/courses/data/data-collection.json",
        "/workspace/courses/data/supply-chain.json",
        "/workspace/courses/data/database.json",
        "/workspace/courses/data/python-basic.json"
    ]
    
    for file_path in files_to_fix:
        fix_json_file(file_path)
