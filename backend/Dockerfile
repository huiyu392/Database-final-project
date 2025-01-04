# 使用 Golang 官方鏡像
FROM golang:1.20 AS builder

# 設定工作目錄
WORKDIR /app

# 複製 Go 相關檔案
COPY go.mod go.sum ./
RUN go mod download

# 複製後端程式碼
COPY . .

# 編譯後端程式
RUN go build -o backend ./cmd/main.go

# 運行後端程式的最小鏡像
FROM debian:buster-slim
WORKDIR /app
COPY --from=builder /app/backend .
COPY --from=builder /app/config ./config

# 對外暴露 Port 3305
EXPOSE 3305

# 執行後端程式
CMD ["./backend"]
