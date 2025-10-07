# 資料庫專題實作 - 人員派遣系統
完成日 2025/01/05 

## 簡介
# 開發目的
系統專為外交部設計，整合員工及眷屬資訊，提升外派管理效率。具備資料檢索、列印、分析與統計功能，強化人力資源規劃與外派人員分布監控，提升透明度與工作效率

# 環境架構
<img width="588" height="370" alt="image" src="https://github.com/user-attachments/assets/9eb2e4a0-3dc7-4574-906d-f0c5a8150825" />

# ER MODEL
<img width="2322" height="1386" alt="image" src="https://github.com/user-attachments/assets/7d0c12f1-0703-4a90-9f4a-36e5cab98e3d" />


## 展示
### 啟動 方式
```
cd frontend
npm start
```

### 部分畫面展示
<img width="1668" height="954" alt="image" src="https://github.com/user-attachments/assets/8d7ef152-49bb-4a34-911d-e6287db23d4a" />
<img width="1310" height="712" alt="image" src="https://github.com/user-attachments/assets/28971244-186f-4a8c-beda-636b3b023419" />
<img width="1516" height="685" alt="image" src="https://github.com/user-attachments/assets/4ac0b61e-f02b-4dfd-a1ac-94bd71d65843" />

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
