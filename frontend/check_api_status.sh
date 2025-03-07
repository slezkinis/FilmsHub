#!/bin/bash

url="http://api:8000/api/status/"
expected_status_code=200
expected_response='{"status": "ok"}'

while true; do
    # Выполняем запрос и сохраняем статус-код и ответ
    response=$(curl -s -w "%{http_code}" -o response.json "$url")
    
    # Проверка статус-кода
    if [ "$response" -eq "$expected_status_code" ]; then
        # Читаем ответ из файла
        npm run start
    else
        echo "Status code is not 200: $response"
    fi

    # Ждем 1 секунду перед следующей проверкой
    sleep 1
done
npm run start