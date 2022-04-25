FROM python:3.8.10-slim

WORKDIR /app

COPY requirements/api.txt .
COPY requirements/model.txt .

RUN pip install -r api.txt
RUN pip install -r model.txt

COPY . .

CMD ["gunicorn", "api:app", "-b", "0.0.0.0"]
