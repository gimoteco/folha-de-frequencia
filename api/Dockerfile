FROM python:3.4-stretch
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP /code/main.py
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/requirements.txt
RUN pip install -r requirements.txt
ADD . /code/
EXPOSE 5000
STOPSIGNAL SIGINT
CMD ["flask", "run"]