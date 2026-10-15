# demo-app

Aplikasi dummy untuk belajar CI/CD (GitHub -> Jenkins -> Docker -> EC2).

## Jalankan lokal
    npm install
    npm test
    npm start          # buka http://localhost:8080

## Jalankan dengan Docker
    docker build -t demo-app .
    docker run -p 8080:8080 demo-app

## Endpoint
- `/`          halaman web
- `/health`    cek kesehatan (dipakai Jenkins)
- `/api/info`  versi, hostname, waktu
