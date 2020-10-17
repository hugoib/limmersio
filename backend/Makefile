setup-env:
	pip install pipenv
	pipenv install
	pip install -r requirements.txt
	python -m textblob.download_corpora
	pip install -U flask-cors

run-model:
	python basemodel.py 

run-backend:
	python api.py