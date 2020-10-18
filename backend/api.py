from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS, cross_origin
from engine import main
import argparse
import json #for tests

app = Flask(__name__)
CORS(app, support_credentials=True)
api = Api(app)

parser = reqparse.RequestParser()

def load_parameters(text, level):
  parser_argument = argparse.ArgumentParser()

  parser_argument.add_argument('--text', default=text, type=str)
  parser_argument.add_argument('--level', default=level, type=str)

  args = parser_argument.parse_known_args()
  return args

class LimmersioEngine(Resource):
    def get(self):
        parser.add_argument("text")
        parser.add_argument("level")
        args = parser.parse_args()

        args = load_parameters(args["text"], args["level"])

        limmersified_text =  main.limmersify(args[0])
        return limmersified_text

api.add_resource(LimmersioEngine, '/limmersify/')

if __name__ == "__main__":
  app.run(debug=True)
  













