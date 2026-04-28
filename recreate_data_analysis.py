import json

data = {
  "course": {
    "title": "数据分析技术",
    "description": "掌握数据分析的基本方法和工具，学习如何从数据中提取有价值的信息。",
    "totalChapters": 6
  },
  "chapters": [
    {
      "id": 1,
      "title": "数据分析概述",
      "duration": "30分钟",
      "difficulty": "入门",
      "completed": True,
      "introduction": "本章将介绍数据分析的基本概念、流程和应用领域，帮助你建立对数据分析的整体认识。",
      "sections": [
        {
          "title": "什么是数据分析？",
          "content": "<p class=\"text-gray-300 mb-4\">数据分析是指通过收集、处理、分析和解释数据，以发现有价值的信息、支持决策制定的过程。</p>"
        },
        {
          "title": "数据分析的流程",
          "content": "<p class=\"text-gray-300 mb-4\">数据分析的典型流程包括：问题定义、数据收集、数据清洗、数据探索、模型构建、结果解释和报告生成。</p>"
        },
        {
          "title": "数据分析的应用领域",
          "content": "<p class=\"text-gray-300 mb-4\">数据分析广泛应用于商业决策、市场营销、金融风控、医疗健康、教育等多个领域。</p>"
        }
      ],
      "summary": [
        { "point": "数据分析定义", "description": "通过数据发现价值的过程" },
        { "point": "分析流程", "description": "问题定义→数据收集→数据清洗→数据探索→模型构建→结果解释→报告生成" },
        { "point": "应用领域", "description": "商业、营销、金融、医疗、教育等" }
      ],
      "exercises": [
        { "id": 1, "title": "数据分析流程", "description": "描述数据分析的基本流程" },
        { "id": 2, "title": "应用场景", "description": "举例说明数据分析在某个领域的应用" },
        { "id": 3, "title": "工具选择", "description": "列出常用的数据分析工具" }
      ]
    },
    {
      "id": 2,
      "title": "数据预处理",
      "duration": "45分钟",
      "difficulty": "入门",
      "completed": False,
      "introduction": "本章将学习数据预处理的基本技术，包括数据清洗、数据转换、特征工程等，这些是数据分析的基础步骤。",
      "sections": [
        {
          "title": "数据清洗",
          "content": "<p class=\"text-gray-300 mb-4\">数据清洗是指处理缺失值、异常值、重复值等问题，确保数据质量的过程。</p>"
        },
        {
          "title": "数据转换",
          "content": "<p class=\"text-gray-300 mb-4\">数据转换包括数据标准化、归一化、编码等操作，使数据更适合分析。</p>"
        },
        {
          "title": "特征工程",
          "content": "<p class=\"text-gray-300 mb-4\">特征工程是指创建、选择和变换特征，以提高模型性能的过程。</p>"
        }
      ],
      "summary": [
        { "point": "数据清洗", "description": "处理缺失值、异常值、重复值" },
        { "point": "数据转换", "description": "标准化、归一化、编码" },
        { "point": "特征工程", "description": "创建、选择和变换特征" }
      ],
      "exercises": [
        { "id": 1, "title": "缺失值处理", "description": "使用Python处理数据中的缺失值" },
        { "id": 2, "title": "数据标准化", "description": "对数据进行标准化处理" },
        { "id": 3, "title": "特征选择", "description": "选择重要的特征进行分析" }
      ]
    },
    {
      "id": 3,
      "title": "数据可视化",
      "duration": "40分钟",
      "difficulty": "入门",
      "completed": False,
      "introduction": "本章将学习数据可视化的基本原理和方法，使用Python的Matplotlib、Seaborn等库创建各种图表。",
      "sections": [
        {
          "title": "数据可视化基础",
          "content": "<p class=\"text-gray-300 mb-4\">数据可视化是通过图表、图形等方式直观展示数据的过程，帮助人们理解数据中的模式和趋势。</p>"
        },
        {
          "title": "Matplotlib库",
          "content": "<p class=\"text-gray-300 mb-4\">Matplotlib是Python中最常用的数据可视化库，可以创建线图、散点图、柱状图等多种图表。</p>"
        },
        {
          "title": "Seaborn库",
          "content": "<p class=\"text-gray-300 mb-4\">Seaborn是基于Matplotlib的高级可视化库，提供了更美观、更复杂的图表类型。</p>"
        }
      ],
      "summary": [
        { "point": "可视化目的", "description": "直观展示数据，发现模式和趋势" },
        { "point": "Matplotlib", "description": "基础可视化库，支持多种图表类型" },
        { "point": "Seaborn", "description": "高级可视化库，提供美观的统计图表" }
      ],
      "exercises": [
        { "id": 1, "title": "折线图", "description": "使用Matplotlib创建折线图" },
        { "id": 2, "title": "柱状图", "description": "使用Seaborn创建柱状图" },
        { "id": 3, "title": "热力图", "description": "使用Seaborn创建热力图" }
      ]
    },
    {
      "id": 4,
      "title": "统计分析",
      "duration": "50分钟",
      "difficulty": "中级",
      "completed": False,
      "introduction": "本章将学习基本的统计分析方法，包括描述性统计、假设检验、相关性分析等，这些是数据分析的核心内容。",
      "sections": [
        {
          "title": "描述性统计",
          "content": "<p class=\"text-gray-300 mb-4\">描述性统计包括均值、中位数、众数、标准差等指标，用于描述数据的基本特征。</p>"
        },
        {
          "title": "假设检验",
          "content": "<p class=\"text-gray-300 mb-4\">假设检验是通过样本数据推断总体特征的方法，包括t检验、方差分析等。</p>"
        },
        {
          "title": "相关性分析",
          "content": "<p class=\"text-gray-300 mb-4\">相关性分析用于研究变量之间的关系强度和方向，常用的方法包括皮尔逊相关系数、斯皮尔曼等级相关等。</p>"
        }
      ],
      "summary": [
        { "point": "描述性统计", "description": "均值、中位数、众数、标准差等" },
        { "point": "假设检验", "description": "t检验、方差分析等" },
        { "point": "相关性分析", "description": "皮尔逊相关系数、斯皮尔曼等级相关等" }
      ],
      "exercises": [
        { "id": 1, "title": "描述性统计", "description": "计算数据的基本统计量" },
        { "id": 2, "title": "假设检验", "description": "进行t检验分析" },
        { "id": 3, "title": "相关性分析", "description": "计算变量之间的相关系数" }
      ]
    },
    {
      "id": 5,
      "title": "机器学习基础",
      "duration": "60分钟",
      "difficulty": "中级",
      "completed": False,
      "introduction": "本章将介绍机器学习的基本概念和常用算法，包括监督学习、无监督学习等，为数据分析提供更强大的工具。",
      "sections": [
        {
          "title": "机器学习概述",
          "content": "<p class=\"text-gray-300 mb-4\">机器学习是让计算机从数据中学习规律，从而对新数据进行预测或决策的技术。</p>"
        },
        {
          "title": "监督学习",
          "content": "<p class=\"text-gray-300 mb-4\">监督学习是使用标记数据进行训练的机器学习方法，包括分类和回归任务。</p>"
        },
        {
          "title": "无监督学习",
          "content": "<p class=\"text-gray-300 mb-4\">无监督学习是使用未标记数据进行训练的机器学习方法，包括聚类和降维任务。</p>"
        }
      ],
      "summary": [
        { "point": "机器学习定义", "description": "让计算机从数据中学习规律" },
        { "point": "监督学习", "description": "使用标记数据，包括分类和回归" },
        { "point": "无监督学习", "description": "使用未标记数据，包括聚类和降维" }
      ],
      "exercises": [
        { "id": 1, "title": "线性回归", "description": "使用线性回归模型预测数据" },
        { "id": 2, "title": "分类算法", "description": "使用分类算法对数据进行分类" },
        { "id": 3, "title": "聚类分析", "description": "使用聚类算法对数据进行聚类" }
      ]
    },
    {
      "id": 6,
      "title": "商务数据分析案例",
      "duration": "45分钟",
      "difficulty": "中级",
      "completed": False,
      "introduction": "本章将通过实际的商务数据分析案例，展示如何将数据分析技术应用到实际业务中，解决真实的商业问题。",
      "sections": [
        {
          "title": "销售数据分析",
          "content": "<p class=\"text-gray-300 mb-4\">通过分析销售数据，了解销售趋势、产品表现、客户行为等，为销售策略提供支持。</p>"
        },
        {
          "title": "客户分析",
          "content": "<p class=\"text-gray-300 mb-4\">通过分析客户数据，了解客户特征、购买行为、忠诚度等，为客户关系管理提供支持。</p>"
        },
        {
          "title": "市场分析",
          "content": "<p class=\"text-gray-300 mb-4\">通过分析市场数据，了解市场趋势、竞争对手、消费者需求等，为市场策略提供支持。</p>"
        }
      ],
      "summary": [
        { "point": "销售数据分析", "description": "分析销售趋势、产品表现、客户行为" },
        { "point": "客户分析", "description": "分析客户特征、购买行为、忠诚度" },
        { "point": "市场分析", "description": "分析市场趋势、竞争对手、消费者需求" }
      ],
      "exercises": [
        { "id": 1, "title": "销售趋势分析", "description": "分析销售数据的时间趋势" },
        { "id": 2, "title": "客户分群", "description": "对客户进行分群分析" },
        { "id": 3, "title": "产品分析", "description": "分析产品的销售表现" }
      ]
    }
  ],
  "problems": {
    "1": [
      {
        "id": 1,
        "title": "数据分析流程",
        "description": "请描述数据分析的基本流程，并解释每个步骤的作用。",
        "input": "无",
        "output": "数据分析的基本流程及各步骤作用",
        "type": "multiple-choice",
        "options": [
          "问题定义→数据收集→数据清洗→数据探索→模型构建→结果解释→报告生成",
          "数据收集→数据清洗→数据探索→模型构建→结果解释→报告生成",
          "问题定义→数据收集→数据探索→模型构建→结果解释→报告生成",
          "数据收集→数据清洗→模型构建→结果解释→报告生成"
        ],
        "correctAnswer": 0
      },
      {
        "id": 2,
        "title": "数据分析工具",
        "description": "以下哪个不是常用的数据分析工具？",
        "input": "无",
        "output": "正确答案",
        "type": "multiple-choice",
        "options": ["Python", "R", "Excel", "Photoshop"],
        "correctAnswer": 3
      },
      {
        "id": 3,
        "title": "数据分析应用",
        "description": "数据分析可以应用于哪些领域？（多选）",
        "input": "无",
        "output": "正确答案",
        "type": "multiple-choice",
        "options": [
          "商业决策",
          "市场营销",
          "金融风控",
          "医疗健康"
        ],
        "correctAnswer": [0, 1, 2, 3]
      }
    ],
    "2": [
      {
        "id": 1,
        "title": "缺失值处理",
        "description": "使用Python处理数据中的缺失值，创建一个包含缺失值的数据集并处理它。",
        "input": "无",
        "output": "处理后的数据集",
        "type": "code",
        "starterCode": "import pandas as pd\nimport numpy as np\n\n# 创建包含缺失值的数据集\ndata = pd.DataFrame({\n    'A': [1, 2, np.nan, 4, 5],\n    'B': [6, np.nan, 8, 9, 10],\n    'C': [11, 12, 13, np.nan, 15]\n})\n\n# 处理缺失值\n# 方法1：删除包含缺失值的行\n# 方法2：用均值填充缺失值\n",
        "solution": "import pandas as pd\nimport numpy as np\n\n# 创建包含缺失值的数据集\ndata = pd.DataFrame({\n    'A': [1, 2, np.nan, 4, 5],\n    'B': [6, np.nan, 8, 9, 10],\n    'C': [11, 12, 13, np.nan, 15]\n})\n\nprint(\"原始数据:\")\nprint(data)\n\n# 方法1：删除包含缺失值的行\ndata_dropna = data.dropna()\nprint(\"\\n删除缺失值后:\")\nprint(data_dropna)\n\n# 方法2：用均值填充缺失值\ndata_fillna = data.fillna(data.mean())\nprint(\"\\n用均值填充后:\")\nprint(data_fillna)"
      },
      {
        "id": 2,
        "title": "数据标准化",
        "description": "对数据进行标准化处理，使用Python实现。",
        "input": "无",
        "output": "标准化后的数据",
        "type": "code",
        "starterCode": "import pandas as pd\nfrom sklearn.preprocessing import StandardScaler\n\n# 创建数据\ndata = pd.DataFrame({\n    'A': [10, 20, 30, 40, 50],\n    'B': [100, 200, 300, 400, 500]\n})\n\n# 标准化处理\n",
        "solution": "import pandas as pd\nfrom sklearn.preprocessing import StandardScaler\n\n# 创建数据\ndata = pd.DataFrame({\n    'A': [10, 20, 30, 40, 50],\n    'B': [100, 200, 300, 400, 500]\n})\n\nprint(\"原始数据:\")\nprint(data)\n\n# 标准化处理\nscaler = StandardScaler()\ndata_scaled = scaler.fit_transform(data)\ndata_scaled_df = pd.DataFrame(data_scaled, columns=data.columns)\n\nprint(\"\\n标准化后:\")\nprint(data_scaled_df)"
      },
      {
        "id": 3,
        "title": "特征选择",
        "description": "使用Python进行特征选择，选择重要的特征。",
        "input": "无",
        "output": "选择后的特征",
        "type": "code",
        "starterCode": "import pandas as pd\nfrom sklearn.datasets import load_iris\nfrom sklearn.feature_selection import SelectKBest, f_classif\n\n# 加载数据\niris = load_iris()\ndata = pd.DataFrame(iris.data, columns=iris.feature_names)\ntarget = iris.target\n\n# 特征选择\n",
        "solution": "import pandas as pd\nfrom sklearn.datasets import load_iris\nfrom sklearn.feature_selection import SelectKBest, f_classif\n\n# 加载数据\niris = load_iris()\ndata = pd.DataFrame(iris.data, columns=iris.feature_names)\ntarget = iris.target\n\nprint(\"原始特征:\")\nprint(data.columns)\n\n# 特征选择\nselector = SelectKBest(f_classif, k=2)\nX_new = selector.fit_transform(data, target)\n\n# 获取选择的特征\nselected_features = data.columns[selector.get_support()]\nprint(\"\\n选择的特征:\")\nprint(selected_features)"
      }
    ]
  }
}

# 保存为JSON文件
with open('/workspace/courses/data/data-analysis.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("成功创建data-analysis.json文件")
