setup-env:
	pip install pipenv
	pipenv install
	python -m textblob.download_corpora

make run:
	python basemodel.py 