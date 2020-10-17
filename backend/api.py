from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS, cross_origin
from engine import main
import argparse

app = Flask(__name__)
CORS(app, support_credentials=True)
api = Api(app)

parser = reqparse.RequestParser()
parser_argument = argparse.ArgumentParser()

parser_argument.add_argument('--text', default="Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain Coffea species. When coffee berries turn from green to bright red in color indicating ripeness they are picked, processed, and dried. Dried coffee seeds are roasted to varying degrees, depending on the desired flavor. Roasted beans are ground and then brewed with near-boiling water to produce the beverage known as coffee. Clinical research indicates that moderate coffee consumption is benign or mildly beneficial as a stimulant in healthy adults, with continuing research on whether long-term consumption reduces the risk of some diseases, although those long-term studies are generally of poor quality.", type=str)
parser_argument.add_argument('--accuracy_value', default=1, type=int)
args = parser_argument.parse_known_args()
main.limmersify(args[0])

class LimmersioEngine(Resource):
    def get(self):
        Reply = 'Hello world!'
        parser.add_argument("text")
        parser.add_argument("level")
        args = parser.parse_args()
        Reply += ' The text is: ' + args["text"]
        Reply += ' And the level is: ' + args["level"]
        #main.limmersify(Reply)
        return Reply

api.add_resource(LimmersioEngine, '/limmersify/')

if __name__ == "__main__":
  app.run(debug=True)













