FROM python:3.10-slim

WORKDIR /app

COPY ./app/requirements.txt ./app/requirements.txt
RUN pip install -r app/requirements.txt

COPY app /app

CMD ["uvicorn", "app:app", "--host", "0.0.0.0" , "--port", "8000"]