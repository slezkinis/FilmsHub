FROM python:3.12-slim

WORKDIR /app
RUN mkdir -p /app/src/static

COPY . /app/
RUN pip install --no-cache-dir -r /app/requirements.txt

CMD bash -c "cd src && python manage.py migrate --noinput && \
             python manage.py loaddata fixtures/fixture.json && \
             gunicorn --bind 0.0.0.0:8000 conf.wsgi:application"
