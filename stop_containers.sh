#!/bin/bash

check_running_containers() {
  docker ps -q
}

running_containers=$(check_running_containers)

if [ -n "$running_containers" ]; then
  echo "Найдены запущенные контейнеры:"
  docker ps
  echo "Останавливаем контейнеры..."
  docker stop $running_containers
  
  echo "Удаляем контейнеры..."
  docker rm $running_containers

  echo "Все контейнеры остановлены и удалены."
else
  echo "Запущенных контейнеров не найдено."
fi

exit 0
