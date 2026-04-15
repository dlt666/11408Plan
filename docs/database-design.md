# 数据库表结构设计

## 1. 用户表 (users)

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | VARCHAR(50) | PRIMARY KEY | 用户唯一标识 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| last_login | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 最后登录时间 |

## 2. 学习计划表 (learning_plans)

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | VARCHAR(50) | PRIMARY KEY | 计划唯一标识 |
| user_id | VARCHAR(50) | REFERENCES users(id) | 所属用户 |
| name | VARCHAR(100) | NOT NULL | 计划名称 |
| description | TEXT | | 计划描述 |
| duration | VARCHAR(20) | | 计划时长 |
| start_date | DATE | | 开始日期 |
| end_date | DATE | | 截止日期 |
| task_times | JSONB | NOT NULL | 每日时间分配 |
| is_template | BOOLEAN | DEFAULT false | 是否为模板 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

## 3. 任务表 (tasks)

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | VARCHAR(50) | PRIMARY KEY | 任务唯一标识 |
| user_id | VARCHAR(50) | REFERENCES users(id) | 所属用户 |
| subject | VARCHAR(50) | NOT NULL | 科目 |
| description | TEXT | NOT NULL | 任务描述 |
| estimated_time | INTEGER | NOT NULL | 预计时长(分钟) |
| actual_time | INTEGER | DEFAULT 0 | 实际时长(分钟) |
| status | VARCHAR(20) | DEFAULT 'pending' | 状态(pending/in-progress/completed) |
| start_time | TIMESTAMP | | 开始时间 |
| pause_time | TIMESTAMP | | 暂停时间 |
| paused_duration | BIGINT | DEFAULT 0 | 暂停时长(毫秒) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

## 4. 学习日志表 (learning_logs)

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | VARCHAR(50) | PRIMARY KEY | 日志唯一标识 |
| user_id | VARCHAR(50) | REFERENCES users(id) | 所属用户 |
| task_id | VARCHAR(50) | REFERENCES tasks(id) | 关联任务 |
| date | DATE | NOT NULL | 日志日期 |
| content | TEXT | NOT NULL | 学习内容 |
| duration | INTEGER | NOT NULL | 学习时长(分钟) |
| notes | TEXT | | 学习心得 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

## 5. 打卡记录表 (checkins)

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | VARCHAR(50) | PRIMARY KEY | 打卡唯一标识 |
| user_id | VARCHAR(50) | REFERENCES users(id) | 所属用户 |
| date | DATE | NOT NULL | 打卡日期 |
| checked | BOOLEAN | DEFAULT false | 是否打卡 |
| tasks | JSONB | | 完成的任务 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 更新时间 |

## 6. 数据类型说明

- **VARCHAR(n)**: 可变长度字符串，n为最大长度
- **TEXT**: 长文本
- **INTEGER**: 整数
- **BOOLEAN**: 布尔值
- **TIMESTAMP**: 时间戳
- **DATE**: 日期
- **JSONB**: JSON格式数据，用于存储复杂结构
- **BIGINT**: 大整数

## 7. 索引设计

| 表名 | 索引字段 | 索引类型 | 描述 |
|-----|---------|---------|------|
| users | id | PRIMARY | 主键索引 |
| learning_plans | id | PRIMARY | 主键索引 |
| learning_plans | user_id | INDEX | 用户查询索引 |
| tasks | id | PRIMARY | 主键索引 |
| tasks | user_id | INDEX | 用户查询索引 |
| learning_logs | id | PRIMARY | 主键索引 |
| learning_logs | user_id | INDEX | 用户查询索引 |
| learning_logs | task_id | INDEX | 任务查询索引 |
| learning_logs | date | INDEX | 日期查询索引 |
| checkins | id | PRIMARY | 主键索引 |
| checkins | user_id | INDEX | 用户查询索引 |
| checkins | date | INDEX | 日期查询索引 |

## 8. 关系图

```
users
  ├── learning_plans (user_id)
  ├── tasks (user_id)
  ├── learning_logs (user_id)
  └── checkins (user_id)

tasks
  └── learning_logs (task_id)
```

## 9. 数据安全性

1. **用户标识**：使用时间戳和随机字符串生成唯一用户标识，无需密码登录
2. **数据隔离**：通过user_id字段确保用户只能访问自己的数据
3. **数据验证**：在应用层对输入数据进行验证，确保数据完整性
4. **权限控制**：使用Supabase的Row Level Security (RLS)确保用户只能操作自己的数据
