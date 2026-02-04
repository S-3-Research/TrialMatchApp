# Intake Form 逻辑文档

## 概述

Intake Form 是一个 3 步问卷，用于收集用户的基本信息和偏好设置，以便为 ChatKit 提供个性化的对话体验。系统支持三种用户场景：未登录（Guest）、已登录、以及中途登录。

---

## 数据存储策略

### Guest 用户
- **存储位置**: `localStorage`
- **存储键**: `intake_data`
- **数据结构**:
```typescript
{
  role: 'user' | 'caregiver',
  response_style: 'concise' | 'balanced' | 'verbose',
  intent: 'trial_matching' | 'learn_about_trials',
  completed_at: '2026-02-03T12:00:00.000Z'
}
```

### 已登录用户
- **存储位置**: Supabase `user_profiles` 表
- **字段**:
  - `intake_role` (TEXT)
  - `intake_response_style` (TEXT)
  - `intake_intent` (TEXT)
  - `intake_completed_at` (TIMESTAMPTZ)
  - `is_caregiver` (BOOLEAN) - 自动从 `intake_role` 同步

---

## 场景 1: Guest 用户（未登录）

### 流程图

```
┌─────────────────┐
│  访问 /chat     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 检查 localStorage│
│ 有 intake_data? │
└────────┬────────┘
         │
    ┌────┴────┐
    │   有    │   无
    ▼         ▼
┌─────┐   ┌──────────────┐
│跳过 │   │显示 Intake   │
│表单 │   │Form Modal    │
└─────┘   └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │ 用户填写表单 │
       │ (3个步骤)    │
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │ 保存到       │
       │ localStorage │
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │ ChatKit 加载 │
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │ 读取 intake  │
       │ 数据并自动   │
       │ 发送上下文   │
       └──────────────┘
```

### 代码位置

1. **检查逻辑**: `/app/App.tsx` - `checkIntakeStatus()` useEffect
2. **表单组件**: `/components/IntakeFormModal.tsx`
3. **数据保存**: `IntakeFormModal.tsx` - `handleComplete()` 保存到 localStorage
4. **上下文发送**: `/components/ChatKitPanel.tsx` - useEffect 读取 localStorage 并调用 `sendUserMessage()`

### 关键代码片段

```typescript
// App.tsx - Guest 用户检查
const stored = localStorage.getItem(INTAKE_STORAGE_KEY);
if (stored) {
  setIntakeCompleted(true);
  setShowIntakeModal(false);
} else {
  setShowIntakeModal(true);
}
```

---

## 场景 2: 已登录用户

### 流程图

```
┌─────────────────┐
│  访问 /chat     │
│  (已登录)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 检查 localStorage│
│ 有 intake_data? │
└────────┬────────┘
         │
    ┌────┴────┐
    │   有    │   无
    ▼         ▼
┌─────┐   ┌──────────────┐
│跳过 │   │ 检查 Supabase│
│表单 │   │ 有 intake?   │
└─────┘   └──────┬───────┘
              │
         ┌────┴────┐
         │   有    │   无
         ▼         ▼
      ┌─────┐  ┌──────────────┐
      │跳过 │  │显示 Intake   │
      │表单 │  │Form Modal    │
      └─────┘  └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │ 用户填写表单 │
            │ (3个步骤)    │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │ 保存到       │
            │ localStorage │
            │ 同时调用 API │
            └──────┬───────┘
                   │
              ┌────┴────┐
              │         │
              ▼         ▼
       ┌──────────┐ ┌──────────┐
       │POST /api/│ │ ChatKit  │
       │migrate-  │ │ 加载     │
       │intake    │ └─────┬────┘
       └────┬─────┘       │
            │             ▼
            ▼      ┌──────────────┐
       ┌──────────┐│ 读取 intake  │
       │ 保存到   ││ 数据并自动   │
       │ Supabase ││ 发送上下文   │
       └──────────┘└──────────────┘
```

### 代码位置

1. **Supabase 检查**: `/app/App.tsx` - `checkIntakeStatus()` 调用 `/api/tools` (get_user_profile)
2. **表单完成**: `/app/App.tsx` - `handleIntakeComplete()` 调用 `/api/migrate-intake`
3. **API Route**: `/app/api/migrate-intake/route.ts` - 保存数据到 Supabase

### 关键代码片段

```typescript
// App.tsx - 已登录用户检查 Supabase
const response = await fetch("/api/tools", {
  method: "POST",
  body: JSON.stringify({
    toolName: "get_user_profile",
    params: {},
  }),
});

const result = await response.json();
if (result.success && result.data?.intake_completed_at) {
  setIntakeCompleted(true);
  setShowIntakeModal(false);
}
```

```typescript
// App.tsx - 保存到 Supabase
const response = await fetch("/api/migrate-intake", {
  method: "POST",
  body: JSON.stringify({
    role: data.role,
    response_style: data.response_style,
    intent: data.intent,
  }),
});
```

---

## 场景 3: 中途登录（Guest → 已登录）

### 流程图

```
┌─────────────────┐
│  Guest 用户     │
│  填写了 Intake  │
│  (存在 localStorage)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  用户点击登录   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Clerk 登录成功 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useEffect 检测  │
│ isSignedIn = true│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 检查 localStorage│
│ 有 intake_data? │
└────────┬────────┘
         │
    ┌────┴────┐
    │   有    │   无
    ▼         ▼
┌──────────┐ ┌─────┐
│ 自动迁移 │ │跳过 │
│ 数据     │ └─────┘
└────┬─────┘
     │
     ▼
┌──────────────┐
│POST /api/    │
│migrate-intake│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 保存到       │
│ Supabase     │
│ user_profiles│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 迁移成功后   │
│ 清除         │
│ localStorage │
└──────────────┘
```

### 代码位置

1. **自动迁移**: `/app/App.tsx` - 监听 `isSignedIn` 变化的 useEffect
2. **迁移 API**: `/app/api/migrate-intake/route.ts`
3. **数据清理**: 成功后 `localStorage.removeItem(INTAKE_STORAGE_KEY)`

### 关键代码片段

```typescript
// App.tsx - 自动迁移逻辑
useEffect(() => {
  if (!isLoaded || !isSignedIn || isMigratingIntake) return;

  const migrateIntakeData = async () => {
    const stored = localStorage.getItem(INTAKE_STORAGE_KEY);
    if (!stored) return;

    setIsMigratingIntake(true);
    const data = JSON.parse(stored) as IntakeData;

    const response = await fetch("/api/migrate-intake", {
      method: "POST",
      body: JSON.stringify({
        role: data.role,
        response_style: data.response_style,
        intent: data.intent,
      }),
    });

    const result = await response.json();
    if (result.success) {
      // 迁移成功，清除 localStorage
      localStorage.removeItem(INTAKE_STORAGE_KEY);
    }
    setIsMigratingIntake(false);
  };

  migrateIntakeData();
}, [isLoaded, isSignedIn, isMigratingIntake]);
```

---

## 数据库 Schema

### user_profiles 表新增字段

```sql
-- Intake form data
intake_role TEXT,                    -- 'user' or 'caregiver'
intake_response_style TEXT,          -- 'concise', 'balanced', or 'verbose'
intake_intent TEXT,                  -- 'trial_matching' or 'learn_about_trials'
intake_completed_at TIMESTAMPTZ,     -- 完成时间戳
```

### 触发器 - 自动同步字段

```sql
CREATE OR REPLACE FUNCTION sync_intake_role_to_is_caregiver()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.intake_role IS NOT NULL THEN
    NEW.is_caregiver = (NEW.intake_role = 'caregiver');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_intake_role
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_intake_role_to_is_caregiver();
```

---

## ChatKit 上下文发送

### 时机
- ChatKit 完全加载后（`chatkit.control` 和 `chatkit.ref` 都就绪）
- 仅发送一次（使用 `hasSetIntakeContext` ref 防止重复）

### 消息格式

根据 intake 数据构建个性化上下文消息：

```javascript
// 示例：caregiver + concise + trial_matching
"I am a caregiver, to find suitable clinical trials, I prefer concise, brief answers."

// 示例：user + verbose + learn_about_trials
"I am a user looking for information, to learn about clinical trials, I prefer detailed, comprehensive explanations."
```

### 代码位置

`/components/ChatKitPanel.tsx` - useEffect 监听 `chatkit.control` 和 `chatkit.ref`

### 关键代码

```typescript
// 读取 localStorage
const intakeData = localStorage.getItem('intake_data');
const data = JSON.parse(intakeData);

// 构建消息
const parts = [];
if (data.role) {
  parts.push(`I am ${data.role === 'caregiver' ? 'a caregiver' : 'a user looking for information'}`);
}
if (data.intent) {
  parts.push(data.intent === 'trial_matching' 
    ? 'to find suitable clinical trials'
    : 'to learn about clinical trials');
}
if (data.response_style) {
  parts.push(data.response_style === 'concise'
    ? 'I prefer concise, brief answers'
    : data.response_style === 'verbose'
    ? 'I prefer detailed, comprehensive explanations'
    : 'I prefer balanced responses');
}

const contextMessage = parts.join(', ') + '.';

// 发送消息
chatkit.ref.current.sendUserMessage({ text: contextMessage });
```

---

## 状态管理总结

| 状态 | Guest | 已登录 | 中途登录 |
|------|-------|--------|----------|
| **数据存储** | localStorage | Supabase | localStorage → Supabase |
| **检查顺序** | localStorage only | localStorage → Supabase | localStorage → 自动迁移 |
| **表单触发** | 无数据时显示 | localStorage 和 Supabase 都无数据时显示 | 已有数据，跳过表单 |
| **保存逻辑** | IntakeFormModal → localStorage | IntakeFormModal → localStorage + API → Supabase | 登录后自动迁移 |
| **上下文发送** | ChatKit 读取 localStorage | ChatKit 读取 localStorage | ChatKit 读取 localStorage |

---

## 文件清单

### 核心文件
- `/app/App.tsx` - 主逻辑控制器
- `/components/IntakeFormModal.tsx` - 表单组件
- `/components/ChatKitPanel.tsx` - ChatKit 集成 + 上下文发送
- `/lib/types/intake.ts` - 类型定义

### API Routes
- `/app/api/migrate-intake/route.ts` - 迁移数据到 Supabase
- `/app/api/tools/route.ts` - get_user_profile 工具

### 数据库
- `/supabase-schema.sql` - 完整 schema
- `/supabase-intake-migration.sql` - Intake 字段迁移 SQL

---

## 测试场景

### 场景 1: 新 Guest 用户
1. ✅ 访问 `/chat` → 显示 Intake Form
2. ✅ 填写 3 步问卷 → 数据保存到 localStorage
3. ✅ ChatKit 加载 → 自动发送上下文消息
4. ✅ 刷新页面 → 不再显示表单（读取 localStorage）

### 场景 2: 新登录用户
1. ✅ 登录后访问 `/chat` → 检查 Supabase 无数据 → 显示 Intake Form
2. ✅ 填写问卷 → 同时保存到 localStorage 和 Supabase
3. ✅ ChatKit 加载 → 自动发送上下文消息
4. ✅ 刷新页面 → 不再显示表单（读取 Supabase）

### 场景 3: Guest → 登录
1. ✅ Guest 填写表单 → localStorage 有数据
2. ✅ 点击登录 → Clerk 认证
3. ✅ 登录成功 → 自动检测 localStorage → 调用 migrate API
4. ✅ 数据迁移到 Supabase → 清除 localStorage
5. ✅ 后续访问 → 从 Supabase 读取数据

### 场景 4: 已有数据的用户
1. ✅ Supabase 已有 intake_completed_at → 直接跳过表单
2. ✅ ChatKit 读取 localStorage 或从用户历史获取偏好

---

## 注意事项

### 数据一致性
- ✅ Trigger 自动同步 `intake_role` → `is_caregiver`
- ✅ 迁移成功后清除 localStorage，避免数据冗余
- ✅ 失败回退：Supabase 保存失败时，保留 localStorage 数据

### 性能优化
- ✅ 使用 `hasSetIntakeContext` ref 防止重复发送上下文
- ✅ `isMigratingIntake` flag 防止并发迁移
- ✅ localStorage 优先检查，减少 API 调用

### 安全性
- ✅ `/api/migrate-intake` 需要认证（Clerk userId）
- ✅ Supabase RLS 策略保护数据
- ✅ 用户只能访问自己的 profile 数据

---

## 未来优化建议

1. **渐进式表单**
   - 允许用户随时更新偏好
   - 在 settings 页面提供编辑入口

2. **智能推荐**
   - 根据对话历史动态调整 response_style
   - 机器学习优化个性化体验

3. **数据分析**
   - 统计不同 intent/role 的使用分布
   - 优化问卷设计

4. **离线支持**
   - Service Worker 缓存 intake 数据
   - 网络恢复后自动同步
