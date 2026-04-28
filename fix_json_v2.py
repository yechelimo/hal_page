import json
import re

def fix_multiline_strings(content):
    # 找到所有双引号包裹的字符串，处理其中的换行符
    def replace_newlines_in_string(match):
        string = match.group(0)
        # 替换字符串内部的换行符为\n
        fixed_string = string.replace('\n', '\\n')
        return fixed_string
    
    # 使用正则表达式匹配JSON字符串
    # 这个模式匹配双引号之间的内容，正确处理转义的引号
    pattern = r'"([^"\\]|\\.)*"'
    
    # 我们需要更精确地处理，让我们用状态机的方式
    result = []
    in_string = False
    escaping = False
    
    for char in content:
        if escaping:
            result.append(char)
            escaping = False
            continue
        
        if char == '\\':
            result.append(char)
            escaping = True
            continue
        
        if char == '"':
            in_string = not in_string
            result.append(char)
            continue
        
        if in_string and char == '\n':
            # 在字符串内的换行符需要转义
            result.append('\\n')
            continue
        
        result.append(char)
    
    return ''.join(result)

def fix_json_file(file_path):
    try:
        # 读取原始文件
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 修复多行字符串问题
        fixed_content = fix_multiline_strings(content)
        
        # 尝试解析修复后的JSON
        try:
            data = json.loads(fixed_content)
            print(f"成功解析JSON文件: {file_path}")
        except json.JSONDecodeError as e:
            print(f"解析JSON失败: {e}")
            # 对于python-basic.json，需要处理true/false的问题
            if 'python-basic' in file_path:
                fixed_content = fixed_content.replace('true', '"true"').replace('false', '"false"')
                try:
                    data = json.loads(fixed_content)
                    print(f"使用特殊处理成功解析JSON文件: {file_path}")
                except json.JSONDecodeError as e2:
                    print(f"特殊处理也失败了: {e2}")
                    return False
            else:
                return False
        
        # 重新正确格式化JSON
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"成功修复并保存JSON文件: {file_path}")
        return True
    except Exception as e:
        print(f"修复JSON文件时发生错误: {e}")
        import traceback
        traceback.print_exc()
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
        print(f"\n正在处理: {file_path}")
        fix_json_file(file_path)
