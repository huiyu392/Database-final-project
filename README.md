# 資料庫專題實作 - 人員派遣系統
完成日 2025/01/05 

## 簡介
### 開發目的
系統專為外交部設計，整合員工及眷屬資訊，提升外派管理效率。具備資料檢索、列印、分析與統計功能，強化人力資源規劃與外派人員分布監控，提升透明度與工作效率

### 環境架構
<img width="588" height="370" alt="image" src="https://github.com/user-attachments/assets/9eb2e4a0-3dc7-4574-906d-f0c5a8150825" />

### ER MODEL
<img width="2322" height="1386" alt="image" src="https://github.com/user-attachments/assets/7d0c12f1-0703-4a90-9f4a-36e5cab98e3d" />


## 展示
### 啟動 方式
```
cd frontend
npm start
```

### 部分畫面展示
- 首頁
  <img width="1198" height="991" alt="image" src="https://github.com/user-attachments/assets/76ff06e9-7913-4ca1-ac39-ecde19c4f21c" />
- 員工管理
  <img width="1643" height="1013" alt="image" src="https://github.com/user-attachments/assets/199a9bd2-c0ae-49db-a99f-5296dddcf3b6" />
- 國家管理
  <img width="1323" height="882" alt="image" src="https://github.com/user-attachments/assets/95c1dca0-6b0b-448b-82f4-b5fbd4cd187f" />
- 外派管理
  <img width="1371" height="809" alt="image" src="https://github.com/user-attachments/assets/f6eef5c3-3088-4e69-b3e8-83f1c176b015" />
- 眷屬管理
  <img width="1415" height="951" alt="image" src="https://github.com/user-attachments/assets/59390906-faff-49a6-9a75-281ef4e186ca" />

### 各項功能操作描述
1. 員工管理
新增資料：新增新員工資料。
刪除資料：透過員工編號將指定員工的資料刪除。
更新資料：更新員工資料。
資料查詢：以員工編號查詢詳細資料。
列印資料：輸出員工資料。
統計功能：按照職等統計員工數量。

2. 國家管理
新增國家：新增新國家資料。
刪除國家：按國家代碼移除資料。
更新國家：修改國家資料。
資料查詢：以編號查詢國家資料。
列印國家：列印國家資料。
統計功能：統計各國的相關人數

3. 外派管理
新增派駐資料：新增派駐員工的詳細資料。
刪除派駐資料：移除特定派駐資料。
更新派駐資料：更新派駐資料。
資料查詢：查詢派駐人員的相關內容。
列印派駐資料：列印員工派駐資料。
統計功能：統計派駐人員資料。

4. 眷屬管理
新增眷屬：新增員工眷屬資料。
刪除眷屬：移除眷屬相關資料。
更新眷屬：更新眷屬資料。
資料查詢：查詢員工眷屬的詳細信息。
列印眷屬：列印眷屬資料。
統計功能：統計眷屬資料。
