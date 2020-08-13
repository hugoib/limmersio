from flask import Flask
from flask_restful import Resource, Api, reqparse

app = Flask(__name__)
api = Api(app)


parser = reqparse.RequestParser()

class LimmersioEngine(Resource):
    def get(self):
        Reply = 'Hello world!'
        parser.add_argument("text")
        parser.add_argument("level")
        args = parser.parse_args()
        Reply += ' The text is: ' + args["text"]
        Reply += ' And the level is: ' + args["level"]
        return Reply

api.add_resource(LimmersioEngine, '/limmersify/')

if __name__ == "__main__":
  app.run(debug=True)













